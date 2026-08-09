import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {theme} from "../lib/theme";
export const ProgressBar = () => {const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig(); return <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: theme.colors.border}}><div style={{height: "100%", width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100], {extrapolateRight: "clamp"})}%`, background: theme.colors.accent}} /></div>;};
