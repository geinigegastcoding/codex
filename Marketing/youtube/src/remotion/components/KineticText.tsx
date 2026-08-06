import type {CSSProperties} from "react";
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../lib/theme";

export const KineticText: React.FC<{text: string; emphasis?: string[]; align?: CSSProperties["textAlign"]}> = ({text, emphasis = [], align = "center"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [0, 0.5 * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const terms = new Set(emphasis.map((term) => term.toLowerCase()));
  return <div style={{fontFamily: theme.fonts.body, fontWeight: 800, fontSize: theme.type.hero, lineHeight: 1.02, letterSpacing: -4, color: theme.colors.ink, textAlign: align, maxWidth: 1600, opacity: progress, translate: `0 ${(1 - progress) * 42}px`}}>{text.split(/(\s+)/).map((part, index) => terms.has(part.replace(/[^a-z0-9.-]/gi, "").toLowerCase()) ? <span key={index} style={{color: theme.colors.accent}}>{part}</span> : part)}</div>;
};
