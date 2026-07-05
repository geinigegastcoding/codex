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
  navy: "#3F3A32",
  ink: "#4A4037",
  muted: "#536179",
  cloud: "#FFFDF8",
  cream: "#FFFCF7",
  peach: "#FFF7ED",
  orange: "#FF6B1A",
  orangeDark: "#C95A16",
  orangeSoft: "#FFEDD5",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  blue: "#2563EB",
  blueSoft: "#DBEAFE",
  pink: "#BE3A5A",
  pinkSoft: "#FFE4E6",
  line: "#EAECEF",
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

const Panel = ({
  children,
  style
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      border: `1px solid ${colors.line}`,
      borderRadius: 8,
      background: "rgba(255, 255, 255, 0.94)",
      boxShadow: "0 22px 60px rgba(83, 97, 121, 0.14)",
      ...style
    }}
  >
    {children}
  </div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      color: colors.orangeDark,
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: 0,
      textTransform: "uppercase"
    }}
  >
    {children}
  </div>
);

const LogoHeader = ({ frame, duration }: { frame: number; duration: number }) => {
  const progress = interpolate(frame, [0, duration - 1], [0, 1], clamp);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 46,
          display: "flex",
          alignItems: "center",
          gap: 18,
          zIndex: 20
        }}
      >
        <Img
          src={staticFile("logo-icon.webp")}
          style={{
            width: 58,
            height: 58,
            objectFit: "contain"
          }}
        />
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: colors.navy, letterSpacing: 0 }}>
            MagisData
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: colors.muted, marginTop: 2 }}>
            Websites en lokale vindbaarheid
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 76,
          top: 50,
          display: "flex",
          gap: 12,
          zIndex: 20
        }}
      >
        {["Website", "SEO", "Contact"].map((label) => (
          <div
            key={label}
            style={{
              border: `1px solid ${colors.line}`,
              borderRadius: 8,
              padding: "12px 18px",
              background: colors.white,
              color: colors.ink,
              fontSize: 18,
              fontWeight: 800
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          right: 76,
          bottom: 46,
          height: 5,
          borderRadius: 8,
          background: colors.line,
          overflow: "hidden",
          zIndex: 20
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: colors.orange
          }}
        />
      </div>
    </>
  );
};

const Background = () => (
  <AbsoluteFill
    style={{
      fontFamily: font,
      background:
        `linear-gradient(135deg, ${colors.cloud} 0%, ${colors.cream} 48%, #F7FBFF 100%)`,
      color: colors.ink,
      overflow: "hidden"
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(63, 58, 50, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 58, 50, 0.045) 1px, transparent 1px)",
        backgroundSize: "72px 72px"
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -140,
        top: 184,
        width: 740,
        height: 120,
        transform: "rotate(-9deg)",
        background: colors.orangeSoft
      }}
    />
    <div
      style={{
        position: "absolute",
        right: -120,
        bottom: 178,
        width: 680,
        height: 112,
        transform: "rotate(-7deg)",
        background: colors.greenSoft
      }}
    />
  </AbsoluteFill>
);

const SvgIcon = ({ type }: { type: "wrench" | "fork" | "search" | "phone" | "site" | "check" }) => {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  if (type === "wrench") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 50, height: 50 }}>
        <path {...shared} d="M36 8a16 16 0 0 0 10 18L24 48a8 8 0 0 1-11-11l22-22A16 16 0 0 0 36 8Z" />
        <path {...shared} d="M16 40h.1" />
      </svg>
    );
  }

  if (type === "fork") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 50, height: 50 }}>
        <path {...shared} d="M18 8v17M26 8v17M18 25h8M22 25v23" />
        <path {...shared} d="M38 8v40M38 8c8 6 8 18 0 24" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <circle {...shared} cx="24" cy="24" r="13" />
        <path {...shared} d="m35 35 10 10" />
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

  if (type === "site") {
    return (
      <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
        <rect {...shared} x="9" y="12" width="38" height="30" rx="4" />
        <path {...shared} d="M9 22h38M17 32h14M17 38h22" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 56" style={{ width: 46, height: 46 }}>
      <path {...shared} d="m14 29 9 9 19-21" />
    </svg>
  );
};

const BusinessTile = ({
  label,
  sub,
  type,
  delay,
  frame
}: {
  label: string;
  sub: string;
  type: "wrench" | "fork";
  delay: number;
  frame: number;
}) => {
  const appear = fit(frame, delay, 18);
  return (
    <Panel
      style={{
        padding: 26,
        display: "flex",
        alignItems: "center",
        gap: 20,
        transform: `translateY(${interpolate(appear, [0, 1], [30, 0])}px)`,
        opacity: appear
      }}
    >
      <div
        style={{
          color: type === "wrench" ? colors.blue : colors.pink,
          background: type === "wrench" ? colors.blueSoft : colors.pinkSoft,
          borderRadius: 8,
          width: 76,
          height: 76,
          display: "grid",
          placeItems: "center"
        }}
      >
        <SvgIcon type={type} />
      </div>
      <div>
        <div style={{ fontSize: 29, fontWeight: 900, color: colors.navy }}>{label}</div>
        <div style={{ marginTop: 6, fontSize: 19, color: colors.muted, fontWeight: 700 }}>{sub}</div>
      </div>
    </Panel>
  );
};

const SearchCard = ({
  query,
  result,
  delay,
  frame
}: {
  query: string;
  result: string;
  delay: number;
  frame: number;
}) => {
  const appear = fit(frame, delay, 16);
  return (
    <Panel
      style={{
        padding: 22,
        marginBottom: 18,
        opacity: appear,
        transform: `translateX(${interpolate(appear, [0, 1], [48, 0])}px)`
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ color: colors.orange }}>
          <SvgIcon type="search" />
        </div>
        <div
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            border: `1px solid ${colors.line}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            fontSize: 20,
            fontWeight: 800,
            color: colors.ink,
            background: colors.cloud
          }}
        >
          {query}
        </div>
      </div>
      <div
        style={{
          marginTop: 18,
          borderLeft: `5px solid ${colors.green}`,
          paddingLeft: 16
        }}
      >
        <div style={{ fontSize: 19, color: colors.muted, fontWeight: 800 }}>Sterke website bovenaan in beeld</div>
        <div style={{ marginTop: 5, fontSize: 27, color: colors.navy, fontWeight: 900 }}>{result}</div>
      </div>
    </Panel>
  );
};

const IntroScene = ({ frame }: { frame: number }) => {
  const headline = fit(frame, 6, 22);
  const sub = fit(frame, 22, 18);
  const right = fit(frame, 34, 22);

  return (
    <AbsoluteFill style={{ padding: "148px 76px 92px", ...slideStyle(frame, 0, 104) }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: 58, height: "100%" }}>
        <div style={{ alignSelf: "center" }}>
          <Eyebrow>Voor loodgieters, restaurants en lokale ondernemers</Eyebrow>
          <div
            style={{
              marginTop: 26,
              fontSize: 84,
              lineHeight: 0.98,
              fontWeight: 950,
              letterSpacing: 0,
              color: colors.navy,
              transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
              opacity: headline
            }}
          >
            Word gekozen voordat de telefoon gaat.
          </div>
          <div
            style={{
              marginTop: 34,
              width: 580,
              fontSize: 31,
              lineHeight: 1.34,
              color: colors.muted,
              fontWeight: 700,
              opacity: sub,
              transform: `translateY(${interpolate(sub, [0, 1], [24, 0])}px)`
            }}
          >
            Wij maken je website duidelijk, snel en vindbaar, zodat klanten je begrijpen en contact opnemen.
          </div>
          <div style={{ marginTop: 38, display: "grid", gap: 18, width: 610 }}>
            <BusinessTile frame={frame} delay={38} type="wrench" label="Loodgieter" sub="Spoed, diensten en werkgebied helder" />
            <BusinessTile frame={frame} delay={50} type="fork" label="Restaurant" sub="Menu, reserveren en vertrouwen direct zichtbaar" />
          </div>
        </div>

        <div
          style={{
            alignSelf: "center",
            opacity: right,
            transform: `translateY(${interpolate(right, [0, 1], [28, 0])}px)`
          }}
        >
          <div
            style={{
              position: "relative",
              height: 680,
              padding: 28,
              borderRadius: 8,
              border: `1px solid ${colors.line}`,
              background: colors.navy,
              boxShadow: "0 30px 80px rgba(63, 58, 50, 0.22)"
            }}
          >
            <div
              style={{
                height: 36,
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 26
              }}
            >
              {[colors.orange, colors.green, colors.blue].map((color) => (
                <span key={color} style={{ width: 14, height: 14, borderRadius: 14, background: color }} />
              ))}
              <span style={{ marginLeft: 12, color: "rgba(255,255,255,0.72)", fontSize: 17, fontWeight: 800 }}>
                Lokale zoekopdracht
              </span>
            </div>
            <SearchCard frame={frame} delay={44} query="loodgieter met spoed Leiden" result="Diensten, regio en belknop direct duidelijk" />
            <SearchCard frame={frame} delay={62} query="restaurant reserveren vanavond" result="Menu, sfeer en reserveren zonder zoeken" />
            <Panel
              style={{
                position: "absolute",
                right: 34,
                bottom: 34,
                width: 335,
                padding: 22,
                background: colors.orange,
                color: colors.white
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900 }}>Doel</div>
              <div style={{ marginTop: 8, fontSize: 29, fontWeight: 950, lineHeight: 1.1 }}>
                Meer relevante aanvragen, minder twijfel.
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ScreenshotDeck = ({ frame }: { frame: number }) => {
  const images = [
    { src: "plumber-website.jpeg", label: "Website voor spoed en service" },
    { src: "barber-website.jpeg", label: "Website die direct sfeer en actie toont" },
    { src: "case-hovenier.webp", label: "Pagina's met bewijs en contactroute" }
  ];

  return (
    <div style={{ position: "relative", height: 650 }}>
      {images.map((image, index) => {
        const local = frame - 96 - index * 24;
        const appear = fit(local, 0, 22);
        const active = interpolate(local, [0, 54, 92], [0.92, 1, 0.74], clamp);
        const x = index * 36;
        const y = index * 28;

        return (
          <Panel
            key={image.src}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 780,
              height: 490,
              padding: 14,
              opacity: appear,
              transform: `translateY(${interpolate(appear, [0, 1], [45, 0])}px) scale(${active})`,
              transformOrigin: "left top"
            }}
          >
            <div
              style={{
                height: 38,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0 6px 10px"
              }}
            >
              {[colors.orange, colors.green, colors.blue].map((color) => (
                <span key={color} style={{ width: 12, height: 12, borderRadius: 12, background: color }} />
              ))}
              <span style={{ marginLeft: 10, fontSize: 15, color: colors.muted, fontWeight: 900 }}>{image.label}</span>
            </div>
            <div
              style={{
                borderRadius: 8,
                overflow: "hidden",
                height: 424,
                border: `1px solid ${colors.line}`
              }}
            >
              <Img src={staticFile(image.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            </div>
          </Panel>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 26,
          display: "flex",
          gap: 16
        }}
      >
        {["Snel", "Mobiel", "Vindbaar"].map((label, index) => (
          <div
            key={label}
            style={{
              borderRadius: 8,
              background: index === 0 ? colors.orange : colors.white,
              color: index === 0 ? colors.white : colors.navy,
              border: `1px solid ${index === 0 ? colors.orange : colors.line}`,
              padding: "14px 20px",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 12px 30px rgba(83, 97, 121, 0.12)"
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuildScene = ({ frame }: { frame: number }) => {
  const start = 84;
  const text = fit(frame, start + 14, 20);
  const pills = [
    ["1", "Professionele website", "Aanbod, bewijs en contact logisch opgebouwd."],
    ["2", "Lokale SEO-structuur", "Diensten en werkgebied herkenbaar voor Google."],
    ["3", "Conversieroute", "Belknop, formulier en vervolgstap zonder gedoe."]
  ];

  return (
    <AbsoluteFill style={{ padding: "148px 76px 92px", ...slideStyle(frame, 82, 190) }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: 52, height: "100%" }}>
        <ScreenshotDeck frame={frame} />
        <div style={{ alignSelf: "center", opacity: text, transform: `translateY(${interpolate(text, [0, 1], [34, 0])}px)` }}>
          <Eyebrow>Wat we maken</Eyebrow>
          <div style={{ marginTop: 24, fontSize: 76, lineHeight: 1.02, fontWeight: 950, color: colors.navy }}>
            Een website die klanten helpt kiezen.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.35, color: colors.muted, fontWeight: 700 }}>
            Niet alleen mooi. Ook logisch voor lokale zoekopdrachten, mobiele bezoekers en de stap naar contact.
          </div>
          <div style={{ marginTop: 38, display: "grid", gap: 18 }}>
            {pills.map(([number, title, description], index) => {
              const item = fit(frame, start + 42 + index * 10, 16);
              return (
                <Panel
                  key={title}
                  style={{
                    padding: 22,
                    display: "grid",
                    gridTemplateColumns: "58px 1fr",
                    gap: 18,
                    alignItems: "center",
                    opacity: item,
                    transform: `translateX(${interpolate(item, [0, 1], [40, 0])}px)`
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 8,
                      background: index === 0 ? colors.orange : index === 1 ? colors.greenSoft : colors.blueSoft,
                      color: index === 0 ? colors.white : index === 1 ? colors.green : colors.blue,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 25,
                      fontWeight: 950
                    }}
                  >
                    {number}
                  </div>
                  <div>
                    <div style={{ fontSize: 27, color: colors.navy, fontWeight: 950 }}>{title}</div>
                    <div style={{ marginTop: 5, fontSize: 19, color: colors.muted, fontWeight: 700 }}>{description}</div>
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FlowCard = ({
  title,
  text,
  type,
  color,
  frame,
  delay
}: {
  title: string;
  text: string;
  type: "search" | "site" | "check" | "phone";
  color: string;
  frame: number;
  delay: number;
}) => {
  const appear = fit(frame, delay, 18);

  return (
    <Panel
      style={{
        padding: 26,
        height: 260,
        opacity: appear,
        transform: `translateY(${interpolate(appear, [0, 1], [42, 0])}px)`
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          display: "grid",
          placeItems: "center",
          borderRadius: 8,
          color,
          background: color === colors.orange ? colors.orangeSoft : color === colors.green ? colors.greenSoft : colors.blueSoft
        }}
      >
        <SvgIcon type={type} />
      </div>
      <div style={{ marginTop: 22, fontSize: 30, color: colors.navy, fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 20, lineHeight: 1.32, color: colors.muted, fontWeight: 700 }}>{text}</div>
    </Panel>
  );
};

const InquiryPanel = ({ frame }: { frame: number }) => {
  const rows = [
    ["09:14", "Lekkage in Leiden", "Belverzoek"],
    ["12:06", "Tafel voor vrijdag", "Reservering"],
    ["15:42", "Nieuwe offerteaanvraag", "Contactformulier"]
  ];

  return (
    <Panel style={{ padding: 24, height: 336, background: colors.navy, color: colors.white }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 23, fontWeight: 950 }}>Contactacties</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", fontWeight: 800 }}>Demo-weergave</div>
      </div>
      <div style={{ marginTop: 22, display: "grid", gap: 13 }}>
        {rows.map(([time, title, tag], index) => {
          const appear = fit(frame, 204 + index * 10, 16);
          return (
            <div
              key={title}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: "15px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.14)",
                opacity: appear,
                transform: `translateX(${interpolate(appear, [0, 1], [26, 0])}px)`
              }}
            >
              <div style={{ color: colors.orangeSoft, fontSize: 17, fontWeight: 900 }}>{time}</div>
              <div style={{ fontSize: 21, fontWeight: 900 }}>{title}</div>
              <div
                style={{
                  borderRadius: 8,
                  padding: "8px 10px",
                  background: colors.white,
                  color: colors.navy,
                  fontSize: 14,
                  fontWeight: 900
                }}
              >
                {tag}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const FlowScene = ({ frame }: { frame: number }) => {
  const start = 172;
  const title = fit(frame, start + 10, 20);

  return (
    <AbsoluteFill style={{ padding: "148px 76px 92px", ...slideStyle(frame, 170, 278) }}>
      <div style={{ height: "100%", display: "grid", gridTemplateRows: "auto 1fr auto", gap: 34 }}>
        <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [30, 0])}px)` }}>
          <Eyebrow>De route die moet kloppen</Eyebrow>
          <div style={{ marginTop: 18, fontSize: 70, lineHeight: 1.04, fontWeight: 950, color: colors.navy }}>
            Van zoekvraag naar vertrouwen naar aanvraag.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, alignSelf: "center" }}>
          <FlowCard frame={frame} delay={198} type="search" color={colors.blue} title="Zoeken" text="Klanten zoeken lokaal en vergelijken snel." />
          <FlowCard frame={frame} delay={208} type="site" color={colors.orange} title="Begrijpen" text="Je website legt aanbod en werkgebied helder uit." />
          <FlowCard frame={frame} delay={218} type="check" color={colors.green} title="Vertrouwen" text="Bewijs, vragen en contactgegevens staan klaar." />
          <FlowCard frame={frame} delay={228} type="phone" color={colors.orange} title="Contact" text="De vervolgstap is zichtbaar en drempelloos." />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr", gap: 24, alignItems: "end" }}>
          <Panel style={{ padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 950, color: colors.navy }}>Website + lokale SEO + conversie</div>
              <div style={{ marginTop: 7, fontSize: 19, color: colors.muted, fontWeight: 700 }}>
                Een praktisch systeem voor ondernemers die online duidelijker willen zijn.
              </div>
            </div>
            <div style={{ color: colors.orange, fontSize: 42, fontWeight: 950 }}>MagisData</div>
          </Panel>
          <InquiryPanel frame={frame} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CtaScene = ({ frame, duration }: { frame: number; duration: number }) => {
  const start = 258;
  const logo = fit(frame, start + 8, 24);
  const headline = fit(frame, start + 26, 20);
  const button = fit(frame, start + 52, 18);
  const scale = interpolate(frame, [start, duration], [1, 1.035], clamp);

  return (
    <AbsoluteFill style={{ padding: "148px 76px 92px", ...slideStyle(frame, 256, duration + 1) }}>
      <div
        style={{
          position: "absolute",
          inset: "140px 76px 100px",
          borderRadius: 8,
          background: colors.white,
          border: `1px solid ${colors.line}`,
          boxShadow: "0 26px 90px rgba(83, 97, 121, 0.15)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 86,
            width: 560,
            height: 88,
            background: colors.blueSoft,
            transform: "rotate(-10deg)"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: 92,
            width: 620,
            height: 94,
            background: colors.orangeSoft,
            transform: "rotate(-8deg)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: "70px 160px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 22,
              opacity: logo,
              transform: `scale(${interpolate(logo, [0, 1], [0.96, 1])})`
            }}
          >
            <Img
              src={staticFile("logo-icon.webp")}
              style={{
                width: 86,
                height: 86,
                objectFit: "contain"
              }}
            />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 52, fontWeight: 950, letterSpacing: 8, color: colors.navy }}>
                MAGISDATA
              </div>
              <div style={{ marginTop: 5, fontSize: 19, fontWeight: 900, color: colors.muted }}>
                Websites voor lokale ondernemers
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 76,
              lineHeight: 1.04,
              fontWeight: 950,
              color: colors.navy,
              maxWidth: 1160,
              opacity: headline,
              transform: `translateY(${interpolate(headline, [0, 1], [34, 0])}px) scale(${scale})`
            }}
          >
            Laat je lokale bedrijf online sterker overkomen.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.35,
              color: colors.muted,
              fontWeight: 700,
              maxWidth: 980,
              opacity: headline
            }}
          >
            Snelle websites, lokale vindbaarheid en duidelijke contactroutes voor ondernemers die gekozen willen worden.
          </div>
          <div
            style={{
              marginTop: 42,
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              borderRadius: 8,
              padding: "22px 34px",
              background: colors.orange,
              color: colors.white,
              fontSize: 28,
              fontWeight: 950,
              opacity: button,
              transform: `translateY(${interpolate(button, [0, 1], [24, 0])}px)`
            }}
          >
            Vraag gratis websiteplan aan
            <span style={{ fontSize: 32, lineHeight: 1 }}>-&gt;</span>
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 22,
              fontWeight: 850,
              color: colors.navy,
              opacity: button
            }}
          >
            magisdata.nl/contact
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LocalBusinessHero = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: font }}>
      <Background />
      <IntroScene frame={frame} />
      <BuildScene frame={frame} />
      <FlowScene frame={frame} />
      <CtaScene frame={frame} duration={durationInFrames} />
      <LogoHeader frame={frame} duration={durationInFrames} />
    </AbsoluteFill>
  );
};
