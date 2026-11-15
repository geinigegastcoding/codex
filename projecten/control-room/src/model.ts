export const services = [
  { id: "portal", name: "Klantportaal", environment: "Staging", host: "portal.magisdata.test", alias: "qa+portal@inbox.magisdata.test", description: "Aflevering van testnotificaties", mark: "KP" },
  { id: "forms", name: "Formulierenlab", environment: "Staging", host: "forms.magisdata.test", alias: "qa+forms@inbox.magisdata.test", description: "Inkomende formulier-events", mark: "FL" },
  { id: "reports", name: "Rapportwerkplaats", environment: "Lokaal", host: "reports.magisdata.test", alias: "qa+reports@inbox.magisdata.test", description: "Controle van lokale rapportjobs", mark: "RW" },
] as const;

export type ServiceId = typeof services[number]["id"];
export type Scenario = "received" | "timeout" | "blocked";
export type EventStatus = "queued" | "processed" | "failed" | "blocked" | "reviewed";
export type RunStatus = "succeeded" | "failed" | "blocked";
export type Job = "inbox-review" | "policy-check";

export interface InboxEvent {
  id: string;
  serviceId: ServiceId;
  scenario: Scenario;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Run {
  id: string;
  serviceId: ServiceId;
  job: Job;
  status: RunStatus;
  detail: string;
  createdAt: string;
}

export interface AuditEntry {
  id: number;
  action: string;
  target: string;
  outcome: string;
  detail: string;
  createdAt: string;
}

export interface State {
  services: typeof services;
  events: InboxEvent[];
  runs: Run[];
  audit: AuditEntry[];
  counts: { events: number; queued: number; attention: number; processed: number; runs: number; audit: number };
  mode: "local-demo";
  updatedAt: string;
}

export interface PolicyResult {
  allowed: boolean;
  code: "HOST_ALLOWED" | "ORIGIN_INVALID" | "HOST_DENIED";
  detail: string;
}

export class InputError extends Error {
  constructor(public code: string, message: string, public status = 400) {
    super(message);
  }
}

export function serviceFor(value: unknown) {
  const service = services.find((entry) => entry.id === value);
  if (!service) throw new InputError("SERVICE_UNKNOWN", "Kies een service uit deze werkruimte.");
  return service;
}

export function requireFields(value: unknown, fields: string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)
    || Object.keys(value).length !== fields.length
    || !fields.every((field) => Object.hasOwn(value, field))) {
    throw new InputError("FIELDS_INVALID", "Onverwachte of ontbrekende velden. Alleen de opgegeven metadata is toegestaan.");
  }
  return value as Record<string, unknown>;
}

export function requireChoice<T extends string>(value: unknown, choices: readonly T[]): T {
  if (typeof value !== "string" || !choices.includes(value as T)) {
    throw new InputError("CHOICE_INVALID", "Deze actie of dit scenario is niet beschikbaar.");
  }
  return value as T;
}

export function checkOrigin(input: string): PolicyResult {
  // Exact ASCII origins only: no credentials, paths, query strings, ports or suffix matching.
  if (!/^https:\/\/[a-z0-9.-]+\/?$/.test(input)) {
    return { allowed: false, code: "ORIGIN_INVALID", detail: "Gebruik een exacte HTTPS-host, zonder pad, poort, inloggegevens of parameters." };
  }
  try {
    const host = new URL(input).hostname;
    if (services.some((service) => service.host === host)) {
      return { allowed: true, code: "HOST_ALLOWED", detail: "Deze demohost staat op de allowlist. Extern verkeer blijft uitgeschakeld." };
    }
  } catch {
    return { allowed: false, code: "ORIGIN_INVALID", detail: "Dit is geen geldige HTTPS-host." };
  }
  return { allowed: false, code: "HOST_DENIED", detail: "Deze host staat niet op de allowlist. Er is geen verbinding gemaakt." };
}

export const scenarioText: Record<Scenario, { title: string; detail: string }> = {
  received: { title: "Testnotificatie ontvangen", detail: "Synthetische aflevermetadata staat klaar voor een lokale beoordeling. Er is geen e-mailbericht opgeslagen." },
  timeout: { title: "Aflevering vertraagd", detail: "Gesimuleerde timeout. Er is geen externe retry. Leg je beoordeling vast om deze melding lokaal af te handelen." },
  blocked: { title: "Host buiten de allowlist", detail: "Een synthetisch event is door het hostbeleid geblokkeerd. Beoordelen heft de blokkade niet op en verstuurt niets." },
};
