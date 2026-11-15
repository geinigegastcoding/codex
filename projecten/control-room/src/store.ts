import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { checkOrigin, InputError, requireChoice, requireFields, serviceFor, services } from "./model.js";
import type { AuditEntry, InboxEvent, Run, Scenario, ServiceId, State } from "./model.js";

export function openStore(path: string) {
  const db = new DatabaseSync(path);
  db.exec("PRAGMA busy_timeout = 3000; PRAGMA journal_mode = WAL;");
  const version = db.prepare("PRAGMA user_version").get()?.user_version;
  if (version !== 0 && version !== 1) {
    db.close();
    throw new Error("Niet-ondersteunde databaseversie. Gebruik de bijbehorende appversie; data wordt niet vervangen.");
  }

  function transaction<T>(work: () => T): T {
    db.exec("BEGIN IMMEDIATE");
    try {
      const result = work();
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  function audit(action: string, target: string, outcome: string, detail: string) {
    db.prepare("INSERT INTO audit (action, target, outcome, detail, createdAt) VALUES (?, ?, ?, ?, ?)")
      .run(action, target, outcome, detail, new Date().toISOString());
  }

  function addEvent(serviceId: ServiceId, scenario: Scenario, createdAt = new Date().toISOString()) {
    const event: InboxEvent = {
      id: randomUUID(), serviceId, scenario,
      status: scenario === "received" ? "queued" : scenario === "timeout" ? "failed" : "blocked",
      createdAt, updatedAt: createdAt,
    };
    db.prepare("INSERT INTO events VALUES (?, ?, ?, ?, ?, ?)")
      .run(event.id, event.serviceId, event.scenario, event.status, event.createdAt, event.updatedAt);
    return event;
  }

  if (version === 0) {
    transaction(() => {
      db.exec(`
        CREATE TABLE events (
          id TEXT PRIMARY KEY, serviceId TEXT NOT NULL CHECK(serviceId IN ('portal', 'forms', 'reports')),
          scenario TEXT NOT NULL CHECK(scenario IN ('received', 'timeout', 'blocked')),
          status TEXT NOT NULL CHECK(status IN ('queued', 'processed', 'failed', 'blocked', 'reviewed')),
          createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
        ) STRICT;
        CREATE TABLE runs (
          id TEXT PRIMARY KEY, serviceId TEXT NOT NULL,
          job TEXT NOT NULL CHECK(job IN ('inbox-review', 'policy-check')),
          status TEXT NOT NULL CHECK(status IN ('succeeded', 'failed', 'blocked')),
          detail TEXT NOT NULL, createdAt TEXT NOT NULL
        ) STRICT;
        CREATE TABLE audit (
          id INTEGER PRIMARY KEY, action TEXT NOT NULL, target TEXT NOT NULL,
          outcome TEXT NOT NULL, detail TEXT NOT NULL, createdAt TEXT NOT NULL
        ) STRICT;
        CREATE TABLE requests (key TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, result TEXT NOT NULL) STRICT;
        CREATE INDEX events_service_status ON events(serviceId, status);
        PRAGMA user_version = 1;
      `);
      const now = Date.now();
      addEvent("portal", "received", new Date(now - 12 * 60_000).toISOString());
      addEvent("forms", "received", new Date(now - 8 * 60_000).toISOString());
      addEvent("portal", "timeout", new Date(now - 5 * 60_000).toISOString());
      addEvent("forms", "blocked", new Date(now - 2 * 60_000).toISOString());
      audit("workspace.created", "local-demo", "succeeded", "Werkruimte gestart met vier synthetische inbox-events.");
    });
  }

  function snapshot(): State {
    const count = (sql: string) => Number(db.prepare(sql).get()?.count);
    return {
      services,
      events: db.prepare("SELECT * FROM events ORDER BY createdAt DESC, rowid DESC LIMIT 100").all() as unknown as InboxEvent[],
      runs: db.prepare("SELECT * FROM runs ORDER BY createdAt DESC, rowid DESC LIMIT 100").all() as unknown as Run[],
      audit: db.prepare("SELECT * FROM audit ORDER BY id DESC LIMIT 100").all() as unknown as AuditEntry[],
      counts: {
        events: count("SELECT COUNT(*) AS count FROM events"),
        queued: count("SELECT COUNT(*) AS count FROM events WHERE status = 'queued'"),
        attention: count("SELECT COUNT(*) AS count FROM events WHERE status IN ('failed', 'blocked')"),
        processed: count("SELECT COUNT(*) AS count FROM events WHERE status IN ('processed', 'reviewed')"),
        runs: count("SELECT COUNT(*) AS count FROM runs"),
        audit: count("SELECT COUNT(*) AS count FROM audit"),
      },
      mode: "local-demo", updatedAt: new Date().toISOString(),
    };
  }

  function execute(action: string, raw: unknown, key: string): unknown {
    // Reject unrecognized fields before either a request fingerprint or audit record can store them.
    let payload: Record<string, unknown>;
    if (action === "demo-events") {
      const input = requireFields(raw, ["serviceId", "scenario"]);
      payload = { serviceId: serviceFor(input.serviceId).id, scenario: requireChoice(input.scenario, ["received", "timeout", "blocked"]) };
    } else if (action === "runs") {
      const input = requireFields(raw, ["serviceId", "job"]);
      payload = { serviceId: serviceFor(input.serviceId).id, job: requireChoice(input.job, ["inbox-review", "policy-check"]) };
    } else if (action === "review") {
      const input = requireFields(raw, ["eventId"]);
      if (typeof input.eventId !== "string" || !/^[a-f0-9-]{36}$/.test(input.eventId)) {
        throw new InputError("EVENT_INVALID", "Ongeldig event-ID.");
      }
      payload = { eventId: input.eventId };
    } else if (action === "policy-check") {
      const input = requireFields(raw, ["origin"]);
      if (typeof input.origin !== "string" || input.origin.length > 512) {
        throw new InputError("ORIGIN_INVALID", "Geef één HTTPS-host op, maximaal 512 tekens.");
      }
      // Never persist the submitted string; it could contain a credential or recovery link.
      const result = checkOrigin(input.origin);
      audit("policy.checked", "allowlist", result.allowed ? "succeeded" : "blocked", result.code);
      return result;
    } else {
      throw new InputError("ACTION_UNKNOWN", "Deze actie bestaat niet.", 404);
    }

    const fingerprint = JSON.stringify({ action, payload });
    return transaction(() => {
      const previous = db.prepare("SELECT fingerprint, result FROM requests WHERE key = ?").get(key);
      if (previous) {
        if (previous.fingerprint !== fingerprint) {
          throw new InputError("KEY_REUSED", "Dit verzoek-ID hoort bij een andere actie. Ververs de pagina.", 409);
        }
        return JSON.parse(String(previous.result)) as unknown;
      }

      let result: unknown;
      if (action === "demo-events") {
        const service = serviceFor(payload.serviceId);
        const policy = checkOrigin(`https://${service.host}`);
        if (!policy.allowed) throw new InputError(policy.code, policy.detail, 403);
        const event = addEvent(service.id, payload.scenario as Scenario);
        audit("event.created", event.id, event.status, `Synthetisch event voor ${service.name}.`);
        result = { id: event.id, message: "Demo-event toegevoegd aan de lokale inbox." };
      } else if (action === "runs") {
        const service = serviceFor(payload.serviceId);
        const policy = checkOrigin(`https://${service.host}`);
        let status: Run["status"] = policy.allowed ? "succeeded" : "blocked";
        let detail = policy.detail;
        if (policy.allowed && payload.job === "inbox-review") {
          const rows = db.prepare("SELECT status, COUNT(*) AS count FROM events WHERE serviceId = ? GROUP BY status").all(service.id);
          const amount = (state: string) => Number(rows.find((row) => row.status === state)?.count ?? 0);
          const failed = amount("failed");
          const blocked = amount("blocked");
          const processed = amount("queued");
          db.prepare("UPDATE events SET status = 'processed', updatedAt = ? WHERE serviceId = ? AND status = 'queued'")
            .run(new Date().toISOString(), service.id);
          status = blocked > 0 ? "blocked" : failed > 0 ? "failed" : "succeeded";
          detail = `${processed} verwerkt · ${failed} fout · ${blocked} geblokkeerd. `
            + (failed + blocked > 0 ? "Openstaande meldingen vragen een beoordeling in de inbox." : "Geen openstaande meldingen. Alleen lokaal uitgevoerd.");
        }
        const id = randomUUID();
        db.prepare("INSERT INTO runs VALUES (?, ?, ?, ?, ?, ?)")
          .run(id, service.id, String(payload.job), status, detail, new Date().toISOString());
        audit("run.completed", id, status, `${service.name}: ${detail}`);
        result = { id, status, message: detail };
      } else {
        const event = db.prepare("SELECT * FROM events WHERE id = ?").get(String(payload.eventId)) as unknown as InboxEvent | undefined;
        if (!event) throw new InputError("EVENT_UNKNOWN", "Dit event bestaat niet.", 404);
        if (event.status !== "failed" && event.status !== "blocked") {
          throw new InputError("EVENT_NOT_ACTIONABLE", "Dit event vraagt geen handmatige beoordeling meer.", 409);
        }
        db.prepare("UPDATE events SET status = 'reviewed', updatedAt = ? WHERE id = ?").run(new Date().toISOString(), event.id);
        audit("event.reviewed", event.id, "reviewed", `Oorspronkelijke status: ${event.status}. Lokaal beoordeeld; geen herverzending of beleidswijziging.`);
        result = { id: event.id, message: "Beoordeling opgeslagen. Er is niets opnieuw verstuurd." };
      }
      db.prepare("INSERT INTO requests VALUES (?, ?, ?)").run(key, fingerprint, JSON.stringify(result));
      return result;
    });
  }

  return {
    snapshot, execute,
    reject: (code: string) => audit("request.rejected", "api", "blocked", code),
    close: () => db.close(),
  };
}

export type Store = ReturnType<typeof openStore>;
