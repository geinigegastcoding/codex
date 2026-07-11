import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

const colors = {
  navy: "#0F172A",
  ink: "#1E293B",
  muted: "#64748B",
  cloud: "#F8FAFC",
  cream: "#F1F5F9",
  orange: "#FF6B1A",
  orangeSoft: "#FFEDD5",
  green: "#16A34A",
  blue: "#2563EB",
  line: "#E2E8F0",
  white: "#FFFFFF"
};

const font = "Arial, Helvetica, Segoe UI, sans-serif";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
} as const;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

const fit = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: easeOut
  });

const sceneOpacity = (frame: number, start: number, end: number) => {
  const enter = interpolate(frame, [start, start + 16], [0, 1], {
    ...clamp,
    easing: easeOut
  });
  const exit = interpolate(frame, [end - 18, end], [1, 0], {
    ...clamp,
    easing: easeIn
  });
  return Math.min(enter, exit);
};

const slideStyle = (
  frame: number,
  start: number,
  end: number,
  y = 34
): CSSProperties => {
  const opacity = sceneOpacity(frame, start, end);
  const translateY = interpolate(opacity, [0, 1], [y, 0], clamp);
  return {
    opacity,
    transform: `translateY(${translateY}px)`
  };
};

const Background = () => (
  <AbsoluteFill
    style={{
      fontFamily: font,
      background: `linear-gradient(135deg, ${colors.cloud} 0%, ${colors.cream} 100%)`,
      color: colors.ink,
      overflow: "hidden"
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)",
        backgroundSize: "72px 72px"
      }}
    />
  </AbsoluteFill>
);

const LogoIcon = () => (
  <Img src={staticFile("logo-icon.webp")} style={{ width: 64, height: 64, objectFit: "contain" }} />
);

const SvgIcon = ({ type, color = "currentColor" }: { type: "check" | "search" | "site" | "phone" | "chart"; color?: string }) => {
  const shared = {
    fill: "none",
    stroke: color,
    strokeWidth: 3.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  if (type === "search") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <circle {...shared} cx="24" cy="24" r="13" />
        <path {...shared} d="m35 35 10 10" />
      </svg>
    );
  }

  if (type === "site") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <rect {...shared} x="9" y="12" width="38" height="30" rx="4" />
        <path {...shared} d="M9 22h38M17 32h14M17 38h22" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <path {...shared} d="M18 9h20a5 5 0 0 1 5 5v28a5 5 0 0 1-5 5H18a5 5 0 0 1-5-5V14a5 5 0 0 1 5-5Z" />
        <path {...shared} d="M24 41h8" />
      </svg>
    );
  }

  if (type === "chart") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <path {...shared} d="M8 48h40M14 48V28M28 48V16M42 48V8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
      <path {...shared} d="m14 29 9 9 19-21" />
    </svg>
  );
};

const IntroScene = ({ frame }: { frame: number }) => {
  const start = 0;
  const end = 95;
  const headline = fit(frame, start + 6, 22);
  const sub = fit(frame, start + 22, 18);

  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, end), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", width: "100%" }}>
      <div style={{ transform: `scale(${interpolate(headline, [0, 1], [0.9, 1])})`, opacity: headline }}>
        <LogoIcon />
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 84,
          lineHeight: 1.05,
          fontWeight: 950,
          color: colors.navy,
          maxWidth: 1200,
          transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
          opacity: headline
        }}
      >
        Word gekozen voordat de telefoon gaat.
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 34,
          color: colors.muted,
          fontWeight: 700,
          maxWidth: 1000,
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [24, 0])}px)`
        }}
      >
        Wij maken je website duidelijk, snel en lokaal vindbaar.
      </div>
    </AbsoluteFill>
  );
};

const SearchScene = ({ frame }: { frame: number }) => {
  const start = 95;
  const end = 190;
  const title = fit(frame, start + 10, 20);
  const searchBar = fit(frame, start + 25, 18);
  const result = fit(frame, start + 45, 18);

  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, end), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%" }}>
      <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 950, color: colors.navy }}>
          Klanten zoeken online, niet op straat.
        </div>
      </div>

      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{
          width: 700, padding: "20px 30px", borderRadius: 40, background: colors.white, border: `2px solid ${colors.line}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 20,
          opacity: searchBar, transform: `translateY(${interpolate(searchBar, [0, 1], [40, 0])}px)`
        }}>
          <SvgIcon type="search" color={colors.muted} />
          <div style={{ fontSize: 32, color: colors.navy, fontWeight: 600 }}>Loodgieter bij mij in de buurt</div>
        </div>

        <div style={{
          marginTop: 40, width: 700, padding: 30, borderRadius: 16, background: colors.white, border: `2px solid ${colors.line}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)", borderLeft: `6px solid ${colors.green}`,
          opacity: result, transform: `translateY(${interpolate(result, [0, 1], [40, 0])}px)`
        }}>
          <div style={{ fontSize: 22, color: colors.muted, fontWeight: 600 }}>Gesponsord · Jouw Bedrijf</div>
          <div style={{ marginTop: 10, fontSize: 34, color: colors.blue, fontWeight: 800 }}>De beste loodgieter in de regio - 24/7 Service</div>
          <div style={{ marginTop: 15, fontSize: 22, color: colors.navy, fontWeight: 500 }}>Snel ter plaatse. Transparante prijzen en direct online contact.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const DemoScene = ({ frame }: { frame: number }) => {
  const start = 190;
  const end = 311;
  const images = [
    { src: "plumber-website.jpeg", title: "Loodgieter" },
    { src: "barber-website.jpeg", title: "Kapper" },
    { src: "case-hovenier.webp", title: "Hovenier" }
  ];

  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, end), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "center", gap: 40 }}>
        {images.map((img, index) => {
          const appear = fit(frame, start + 10 + index * 10, 20);
          return (
            <div
              key={img.src}
              style={{
                width: 400,
                height: 600,
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${colors.line}`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                background: colors.white,
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [60, 0])}px)`
              }}
            >
              <Img src={staticFile(img.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: 60, display: "flex", width: "100%", justifyContent: "center", gap: 60 }}>
        {["Snel", "Mobiel vriendelijk", "Lokaal vindbaar"].map((label, index) => {
          const appear = fit(frame, start + 50 + index * 10, 15);
          return (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: appear, transform: `scale(${interpolate(appear, [0, 1], [0.8, 1])})` }}>
              <div style={{ color: colors.orange }}>
                <SvgIcon type="check" />
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: colors.navy }}>{label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const FlowScene = ({ frame }: { frame: number }) => {
  const start = 311;
  const end = 419;
  const title = fit(frame, start + 10, 20);

  const steps = [
    { icon: "search" as const, title: "1. Zoeken", desc: "Ze zoeken lokaal" },
    { icon: "site" as const, title: "2. Begrijpen", desc: "Het aanbod is helder" },
    { icon: "phone" as const, title: "3. Contact", desc: "Zonder gedoe" }
  ];

  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, end), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%" }}>
      <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 950, color: colors.navy }}>
          Maak het makkelijk om te kiezen.
        </div>
      </div>

      <div style={{ marginTop: 80, display: "flex", width: "100%", justifyContent: "center", gap: 120 }}>
        {steps.map((step, index) => {
          const appear = fit(frame, start + 30 + index * 15, 20);
          return (
            <div
              key={step.title}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                opacity: appear,
                transform: `translateY(${interpolate(appear, [0, 1], [40, 0])}px)`
              }}
            >
              <div style={{ width: 140, height: 140, borderRadius: 24, background: colors.white, border: `2px solid ${colors.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.orange, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div style={{ transform: "scale(1.8)" }}>
                  <SvgIcon type={step.icon} />
                </div>
              </div>
              <div style={{ marginTop: 35, fontSize: 38, fontWeight: 900, color: colors.navy }}>{step.title}</div>
              <div style={{ marginTop: 12, fontSize: 26, color: colors.muted, fontWeight: 700 }}>{step.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const DashboardScene = ({ frame }: { frame: number }) => {
  const start = 419;
  const end = 514;
  const title = fit(frame, start + 10, 20);
  const card1 = fit(frame, start + 25, 20);
  const card2 = fit(frame, start + 40, 20);

  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, end), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%" }}>
      <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 950, color: colors.navy }}>
          Meer leads, direct meetbaar.
        </div>
      </div>

      <div style={{ marginTop: 70, display: "flex", gap: 50, width: "100%", justifyContent: "center" }}>
        <div style={{
          width: 400, padding: 40, borderRadius: 24, background: colors.white, border: `2px solid ${colors.line}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          opacity: card1, transform: `translateY(${interpolate(card1, [0, 1], [40, 0])}px)`
        }}>
          <SvgIcon type="chart" color={colors.green} />
          <div style={{ marginTop: 25, fontSize: 26, color: colors.muted, fontWeight: 700 }}>Website Bezoekers</div>
          <div style={{ marginTop: 15, fontSize: 64, color: colors.navy, fontWeight: 900 }}>+42%</div>
        </div>

        <div style={{
          width: 400, padding: 40, borderRadius: 24, background: colors.white, border: `2px solid ${colors.line}`,
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          opacity: card2, transform: `translateY(${interpolate(card2, [0, 1], [40, 0])}px)`
        }}>
          <SvgIcon type="phone" color={colors.orange} />
          <div style={{ marginTop: 25, fontSize: 26, color: colors.muted, fontWeight: 700 }}>Nieuwe Aanvragen</div>
          <div style={{ marginTop: 15, fontSize: 64, color: colors.navy, fontWeight: 900 }}>18</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene = ({ frame }: { frame: number }) => {
  const start = 514;
  const end = 570;
  const appear = fit(frame, start + 10, 15);
  
  return (
    <AbsoluteFill style={{ ...slideStyle(frame, start, 999), display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", background: colors.orange, width: "100%" }}>
      <div style={{ opacity: appear, transform: `translateY(${interpolate(appear, [0, 1], [40, 0])}px)`, width: "100%" }}>
        <div style={{ background: colors.white, padding: 30, borderRadius: "50%", display: "inline-block" }}>
          <LogoIcon />
        </div>
        <div style={{ marginTop: 50, fontSize: 80, fontWeight: 950, color: colors.white }}>
          Klaar voor meer aanvragen?
        </div>
        <div style={{ marginTop: 40, fontSize: 36, fontWeight: 800, color: colors.orangeSoft }}>
          Ontdek jouw kansen op
        </div>
        <div style={{ marginTop: 10, fontSize: 50, fontWeight: 950, color: colors.white }}>
          magisdata.nl
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LocalBusinessHero = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <Background />
      <IntroScene frame={frame} />
      <SearchScene frame={frame} />
      <DemoScene frame={frame} />
      <FlowScene frame={frame} />
      <DashboardScene frame={frame} />
      <OutroScene frame={frame} />
    </AbsoluteFill>
  );
};
