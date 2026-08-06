import {theme} from "../lib/theme";

export const SourceLabel: React.FC<{url: string; claim?: string}> = ({url, claim}) => {
  let host = url;
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch {}
  return <div style={{position: "absolute", left: theme.spacing.safeX, bottom: 220, display: "flex", alignItems: "center", gap: 12, maxWidth: 1120, padding: "12px 18px", background: "rgba(8,14,16,0.96)", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.sm, fontFamily: theme.fonts.body, fontSize: 24, color: theme.colors.muted}}><strong style={{color: theme.colors.evidence}}>SOURCE</strong><span>{host}</span>{claim ? <span>· {claim}</span> : null}</div>;
};
