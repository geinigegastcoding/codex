import {interpolate, useCurrentFrame} from "remotion";
import {theme} from "../lib/theme";

export const CodeBlock: React.FC<{language: string; code: string}> = ({language, code}) => {
  const frame = useCurrentFrame();
  const lines = code.split("\n");
  return <div style={{width: 1440, background: theme.colors.code, color: "#E6EDF3", borderRadius: theme.radius.lg, padding: 44, boxShadow: theme.shadow, fontFamily: theme.fonts.mono}}><div style={{fontFamily: theme.fonts.body, color: "#9AA9BD", fontSize: 25, marginBottom: 28}}>{language}</div>{lines.map((line, index) => <div key={`${index}-${line}`} style={{fontSize: theme.type.code, lineHeight: 1.55, opacity: interpolate(frame, [index * 5, index * 5 + 8], [0.16, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), translate: `${interpolate(frame, [index * 5, index * 5 + 8], [-18, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}px 0`}}><span style={{color: "#64748B", display: "inline-block", width: 58}}>{index + 1}</span>{line || " "}</div>)}</div>;
};
