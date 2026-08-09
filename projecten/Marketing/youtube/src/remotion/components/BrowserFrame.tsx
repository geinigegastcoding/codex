import {Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {theme} from "../lib/theme";

export const BrowserFrame: React.FC<{asset?: string; title?: string; children?: React.ReactNode; focus?: {x: number; y: number}}> = ({asset, title = "Local AI workspace", children, focus}) => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <div style={{width: 1480, height: 760, background: theme.colors.surface, border: `2px solid ${theme.colors.border}`, borderRadius: theme.radius.lg, overflow: "hidden", boxShadow: theme.shadow, opacity: entrance, scale: 0.94 + entrance * 0.06}}>
    <div style={{height: 72, display: "flex", alignItems: "center", gap: 14, padding: "0 26px", borderBottom: `2px solid ${theme.colors.border}`, fontFamily: theme.fonts.body, color: theme.colors.muted, fontSize: 26}}><span style={{color: "#ED6A5E"}}>●</span><span style={{color: "#F4BF4F"}}>●</span><span style={{color: "#61C554"}}>●</span><div style={{marginLeft: 18, background: theme.colors.code, borderRadius: 14, padding: "11px 22px", flex: 1}}>{title}</div></div>
    <div style={{position: "relative", height: 688, overflow: "hidden"}}>{asset ? <Img src={staticFile(asset)} style={{width: "100%", height: "100%", objectFit: "cover"}} /> : children}{focus ? <div style={{position: "absolute", left: focus.x - 40, top: focus.y - 40, width: 80, height: 80, borderRadius: 999, border: `5px solid ${theme.colors.accent}`, boxShadow: `0 0 0 14px ${theme.colors.accentSoft}88`}} /> : null}</div>
  </div>;
};
