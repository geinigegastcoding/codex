import {Audio} from "@remotion/media";
import {AbsoluteFill, Img, Sequence, staticFile} from "remotion";
import type {ScriptScene} from "../../pipeline/schemas";
import {BrowserFrame} from "../components/BrowserFrame";
import {CaptionLayer} from "../components/CaptionLayer";
import {CodeBlock} from "../components/CodeBlock";
import {Comparison} from "../components/Comparison";
import {Diagram} from "../components/Diagram";
import {KineticText} from "../components/KineticText";
import {ProgressBar} from "../components/ProgressBar";
import {ScreenRecording} from "../components/ScreenRecording";
import {SourceLabel} from "../components/SourceLabel";
import type {VideoProps} from "../lib/schemas";
import {theme} from "../lib/theme";

const PlaceholderUi = () => <div style={{display: "grid", gridTemplateColumns: "300px 1fr", height: "100%", fontFamily: theme.fonts.body}}><div style={{padding: 34, background: "#F0F3F7", borderRight: `2px solid ${theme.colors.border}`}}><strong style={{fontSize: 34}}>Workspace</strong>{["Models", "Files", "Prompts", "Runs"].map((item, index) => <div key={item} style={{marginTop: 26, padding: 16, borderRadius: 12, background: index === 1 ? theme.colors.accentSoft : "transparent", color: index === 1 ? theme.colors.accent : theme.colors.muted, fontSize: 28}}>{item}</div>)}</div><div style={{padding: 48}}><div style={{fontSize: 46, fontWeight: 800, color: theme.colors.ink}}>Choose what leaves your machine</div><div style={{marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24}}>{["Local model", "Cloud model", "Private files", "Public prompt"].map((item, index) => <div key={item} style={{padding: 28, border: `2px solid ${index % 2 ? theme.colors.border : theme.colors.accent}`, borderRadius: 20, fontSize: 30}}>{item}</div>)}</div></div></div>;

const SceneContent: React.FC<{scene: ScriptScene}> = ({scene}) => {
  const visual = scene.visual;
  let content: React.ReactNode;
  if (visual.type === "kinetic-text") content = <KineticText text={scene.onScreenText ?? scene.narration} emphasis={visual.emphasis} />;
  else if (visual.type === "browser") content = <BrowserFrame asset={visual.asset || undefined} focus={visual.focus}><PlaceholderUi /></BrowserFrame>;
  else if (visual.type === "screenshot") content = <Img src={staticFile(visual.asset)} style={{maxWidth: 1540, maxHeight: 780, objectFit: "contain", borderRadius: theme.radius.lg, boxShadow: theme.shadow}} />;
  else if (visual.type === "screen-recording") content = <ScreenRecording asset={visual.asset} trimBefore={visual.start ? Math.round(visual.start * 30) : undefined} trimAfter={visual.end ? Math.round(visual.end * 30) : undefined} focus={visual.focus} />;
  else if (visual.type === "code") content = <CodeBlock language={visual.language} code={visual.code} />;
  else if (visual.type === "diagram") content = <Diagram template={visual.template} data={visual.data} />;
  else if (visual.type === "comparison") content = <Comparison data={visual.data} />;
  else content = <Img src={staticFile(visual.asset)} style={{width: "100%", height: "100%", objectFit: "cover"}} />;

  return <AbsoluteFill style={{background: theme.colors.background, padding: `${theme.spacing.safeY}px ${theme.spacing.safeX}px`, justifyContent: "center", alignItems: "center", boxSizing: "border-box"}}>{content}{scene.sources?.[0] ? <SourceLabel url={scene.sources[0].url} claim={scene.sources[0].claim} /> : null}</AbsoluteFill>;
};

export const ExplainerVideo: React.FC<VideoProps> = ({script, storyboard, captions, audioEnabled, captionTheme}) => <AbsoluteFill style={{background: theme.colors.background}}>
  {storyboard.scenes.map((timing) => {
    const scene = script.scenes.find((candidate) => candidate.id === timing.sceneId);
    if (!scene) throw new Error(`Storyboard references missing scene: ${timing.sceneId}`);
    return <Sequence key={scene.id} from={timing.startFrame} durationInFrames={timing.durationInFrames} name={`${scene.section}: ${scene.id}`}><SceneContent scene={scene} />{audioEnabled && timing.audio ? <Audio src={staticFile(timing.audio)} /> : null}</Sequence>;
  })}
  <CaptionLayer captions={captions} variant={captionTheme} />
  <ProgressBar />
</AbsoluteFill>;
