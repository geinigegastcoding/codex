import {Composition, type CalculateMetadataFunction} from "remotion";
import {ExplainerVideo} from "./compositions/ExplainerVideo";
import {videoPropsSchema, type VideoProps} from "./lib/schemas";
import {exampleProps, smokeProps} from "./sample";

const calculateMetadata: CalculateMetadataFunction<VideoProps> = ({props}) => ({
  durationInFrames: props.storyboard.totalFrames,
  fps: props.storyboard.fps,
  width: props.storyboard.width,
  height: props.storyboard.height,
  defaultOutName: `${props.script.slug}.mp4`,
  defaultCodec: "h264",
});

export const RemotionRoot: React.FC = () => <>
  <Composition id="ExplainerVideo" component={ExplainerVideo} schema={videoPropsSchema} defaultProps={exampleProps} durationInFrames={exampleProps.storyboard.totalFrames} fps={30} width={1920} height={1080} calculateMetadata={calculateMetadata} />
  <Composition id="ExampleExplainer" component={ExplainerVideo} schema={videoPropsSchema} defaultProps={exampleProps} durationInFrames={exampleProps.storyboard.totalFrames} fps={30} width={1920} height={1080} />
  <Composition id="SmokeTest" component={ExplainerVideo} schema={videoPropsSchema} defaultProps={smokeProps} durationInFrames={smokeProps.storyboard.totalFrames} fps={30} width={1920} height={1080} />
</>;
