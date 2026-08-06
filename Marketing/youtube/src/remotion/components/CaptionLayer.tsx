import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import type {CaptionData} from "../../pipeline/schemas";
import {theme} from "../lib/theme";

export const CaptionLayer: React.FC<{captions: CaptionData[]; variant?: "dark" | "light" | "minimal"}> = ({captions, variant = "dark"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const timeMs = frame / fps * 1000;
  const caption = captions.find((item) => timeMs >= item.startMs && timeMs < item.endMs);
  if (!caption) return null;
  const opacity = interpolate(timeMs, [caption.startMs, caption.startMs + 100, caption.endMs - 100, caption.endMs], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const background = variant === "minimal" ? "transparent" : variant === "light" ? "rgba(255,255,255,0.94)" : theme.captions.background;
  const color = variant === "light" ? theme.colors.ink : "white";
  return <div style={{position: "absolute", left: 240, right: 240, bottom: theme.captions.bottom, display: "flex", justifyContent: "center", pointerEvents: "none", opacity}}><div style={{maxWidth: theme.captions.maxWidth, padding: variant === "minimal" ? 0 : "16px 26px", borderRadius: 16, background, color, fontFamily: theme.fonts.body, fontSize: theme.type.caption, fontWeight: 750, lineHeight: theme.captions.lineHeight, textAlign: "center", textShadow: variant === "minimal" ? "0 3px 12px rgba(0,0,0,.75)" : "none"}}>{caption.text}</div></div>;
};
