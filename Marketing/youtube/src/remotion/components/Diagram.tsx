import {interpolate, useCurrentFrame} from "remotion";
import {theme} from "../lib/theme";

type DiagramData = {nodes?: Array<{id: string; label: string; detail?: string}>; edges?: Array<{from: string; to: string; label?: string}>};

export const Diagram: React.FC<{template: string; data: unknown}> = ({template, data}) => {
  const frame = useCurrentFrame();
  const parsed = data as DiagramData;
  const nodes = parsed.nodes ?? [];
  return <div style={{width: 1560, display: "flex", flexDirection: "column", gap: 38, fontFamily: theme.fonts.body}}><div style={{fontSize: theme.type.label, color: theme.colors.muted, textTransform: "uppercase", letterSpacing: 4}}>{template}</div><div style={{display: "flex", alignItems: "stretch", justifyContent: "center", gap: 28}}>{nodes.map((node, index) => <div key={node.id} style={{display: "flex", alignItems: "center", gap: 28, opacity: interpolate(frame, [index * 12, index * 12 + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), translate: `0 ${interpolate(frame, [index * 12, index * 12 + 14], [36, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}px`}}><div style={{width: 360, minHeight: 230, boxSizing: "border-box", borderRadius: theme.radius.lg, background: theme.colors.surface, border: `3px solid ${index === nodes.length - 1 ? theme.colors.accent : theme.colors.border}`, padding: 34, boxShadow: theme.shadow}}><div style={{fontSize: 40, fontWeight: 800, color: theme.colors.ink}}>{node.label}</div>{node.detail ? <div style={{fontSize: 28, color: theme.colors.muted, marginTop: 18, lineHeight: 1.35}}>{node.detail}</div> : null}</div>{index < nodes.length - 1 ? <div style={{fontSize: 54, color: theme.colors.accent}}>→</div> : null}</div>)}</div></div>;
};
