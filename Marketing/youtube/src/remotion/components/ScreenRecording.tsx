import {Video} from "@remotion/media";
import {interpolate, staticFile, useCurrentFrame} from "remotion";
import {theme} from "../lib/theme";

export const ScreenRecording: React.FC<{asset: string; trimBefore?: number; trimAfter?: number; focus?: {x: number; y: number; scale: number}}> = ({asset, trimBefore, trimAfter, focus}) => {
  const frame = useCurrentFrame();
  const focusProgress = interpolate(frame, [18, 42], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const scale = focus ? 1 + (focus.scale - 1) * focusProgress : 1;
  return <div style={{width: 1500, height: 820, overflow: "hidden", borderRadius: theme.radius.lg, boxShadow: theme.shadow, background: theme.colors.code}}><Video src={staticFile(asset)} trimBefore={trimBefore} trimAfter={trimAfter} style={{width: "100%", height: "100%", objectFit: "cover", scale, transformOrigin: focus ? `${focus.x}px ${focus.y}px` : "center"}} /></div>;
};
