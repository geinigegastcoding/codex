import {interpolate, useCurrentFrame} from "remotion";
import {theme} from "../lib/theme";

type ComparisonData = {columns?: string[]; rows?: Array<{label: string; values: Array<string | number | boolean>}>};
export const Comparison: React.FC<{data: unknown}> = ({data}) => {
  const frame = useCurrentFrame();
  const parsed = data as ComparisonData;
  return <div style={{width: 1500, fontFamily: theme.fonts.body, background: theme.colors.surface, borderRadius: theme.radius.lg, border: `2px solid ${theme.colors.border}`, overflow: "hidden", boxShadow: theme.shadow}}><div style={{display: "grid", gridTemplateColumns: `1.2fr repeat(${parsed.columns?.length ?? 0}, 1fr)`, background: theme.colors.header, color: theme.colors.ink, padding: "28px 34px", fontSize: 31, fontWeight: 700}}><span>Criterion</span>{parsed.columns?.map((column) => <span key={column}>{column}</span>)}</div>{parsed.rows?.map((row, index) => <div key={row.label} style={{display: "grid", gridTemplateColumns: `1.2fr repeat(${parsed.columns?.length ?? 0}, 1fr)`, padding: "27px 34px", fontSize: 32, color: theme.colors.ink, borderTop: `1px solid ${theme.colors.border}`, opacity: interpolate(frame, [index * 8, index * 8 + 10], [0.25, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}><strong>{row.label}</strong>{row.values.map((value, valueIndex) => <span key={`${row.label}-${valueIndex}`} style={{color: value === true ? theme.colors.evidence : value === false ? theme.colors.warning : theme.colors.ink}}>{typeof value === "boolean" ? value ? "Yes" : "No" : value}</span>)}</div>)}</div>;
};
