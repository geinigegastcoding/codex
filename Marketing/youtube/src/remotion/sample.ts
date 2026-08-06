import type {VideoProps} from "./lib/schemas";

const seconds = (value: number) => value * 30;

export const exampleProps: VideoProps = {
  audioEnabled: false,
  captionTheme: "dark",
  script: {
    title: "The AI Privacy Switch Most Tools Hide",
    slug: "ai-privacy-switch",
    template: "technical-concept",
    targetDurationSeconds: 75,
    scenes: [
      {id: "hook", section: "hook", narration: "An AI tool can run locally and still send your data to the cloud. Local is a location. Privacy is a data-flow decision.", onScreenText: "Local does not automatically mean private", visual: {type: "kinetic-text", emphasis: ["not", "private"]}, targetSeconds: 10},
      {id: "ui", section: "problem", narration: "The useful question is not where the interface runs. Ask where the model runs, where files are stored, and whether telemetry leaves the device.", onScreenText: "Trace the data, not the label", visual: {type: "browser", asset: "videos/ai-privacy-switch/assets/local-ai-ui.svg", focus: {x: 940, y: 360}}, targetSeconds: 13},
      {id: "flow", section: "model", narration: "A practical check has three steps. Input enters the app. The app chooses a model endpoint. Then logs, files, or prompts may be retained somewhere else.", visual: {type: "diagram", template: "data-flow check", data: {nodes: [{id: "input", label: "Your input", detail: "Prompt, file, or code"}, {id: "endpoint", label: "Model endpoint", detail: "Local process or remote API"}, {id: "retention", label: "Retention", detail: "Logs, history, and telemetry"}]}}, targetSeconds: 14},
      {id: "config", section: "example", narration: "In code, make the endpoint and logging choices explicit. A local URL is evidence. It is not proof that every other service is disabled.", visual: {type: "code", language: "typescript", code: "const ai = createClient({\n  baseUrl: 'http://127.0.0.1:11434',\n  telemetry: false,\n  retainPrompts: false,\n});"}, targetSeconds: 13},
      {id: "compare", section: "example", narration: "This creates a more useful comparison. Fully local keeps model calls and files on-device. A hybrid workflow may keep files local but send selected prompts remotely.", visual: {type: "comparison", data: {columns: ["Fully local", "Hybrid"], rows: [{label: "Model call stays on-device", values: [true, false]}, {label: "Files can stay local", values: [true, true]}, {label: "Requires network", values: [false, true]}]}}, targetSeconds: 14},
      {id: "payoff", section: "payoff", narration: "So do not buy the word local. Draw the data flow. Check the endpoint, storage, and telemetry. That is the privacy test you can repeat for any AI tool.", onScreenText: "Endpoint. Storage. Telemetry.", visual: {type: "kinetic-text", emphasis: ["Endpoint.", "Storage.", "Telemetry."]}, sources: [{url: "https://www.nist.gov/privacy-framework", claim: "Privacy risk management reference"}], targetSeconds: 11},
    ],
  },
  storyboard: {
    fps: 30, width: 1920, height: 1080, totalFrames: seconds(75),
    scenes: [
      {sceneId: "hook", startFrame: seconds(0), durationInFrames: seconds(10), transitionFrames: 0},
      {sceneId: "ui", startFrame: seconds(10), durationInFrames: seconds(13), transitionFrames: 0},
      {sceneId: "flow", startFrame: seconds(23), durationInFrames: seconds(14), transitionFrames: 0},
      {sceneId: "config", startFrame: seconds(37), durationInFrames: seconds(13), transitionFrames: 0},
      {sceneId: "compare", startFrame: seconds(50), durationInFrames: seconds(14), transitionFrames: 0},
      {sceneId: "payoff", startFrame: seconds(64), durationInFrames: seconds(11), transitionFrames: 0},
    ],
  },
  captions: [
    {text: "An AI tool can run locally", startMs: 200, endMs: 2800, timestampMs: null, confidence: null, sceneId: "hook"},
    {text: "and still send your data to the cloud.", startMs: 2900, endMs: 5600, timestampMs: null, confidence: null, sceneId: "hook"},
    {text: "Local is a location. Privacy is a data-flow decision.", startMs: 5800, endMs: 9600, timestampMs: null, confidence: null, sceneId: "hook"},
    {text: "Trace the model, files, and telemetry.", startMs: 11000, endMs: 15000, timestampMs: null, confidence: null, sceneId: "ui"},
    {text: "Input. Endpoint. Retention.", startMs: 24000, endMs: 28500, timestampMs: null, confidence: null, sceneId: "flow"},
    {text: "Make endpoint and logging choices explicit.", startMs: 38500, endMs: 43000, timestampMs: null, confidence: null, sceneId: "config"},
    {text: "Fully local and hybrid solve different problems.", startMs: 51500, endMs: 56500, timestampMs: null, confidence: null, sceneId: "compare"},
    {text: "Endpoint. Storage. Telemetry.", startMs: 66000, endMs: 70500, timestampMs: null, confidence: null, sceneId: "payoff"},
    {text: "That is the repeatable privacy test.", startMs: 70600, endMs: 74600, timestampMs: null, confidence: null, sceneId: "payoff"},
  ],
};

export const smokeProps: VideoProps = {...exampleProps, storyboard: {...exampleProps.storyboard, totalFrames: 450, scenes: exampleProps.storyboard.scenes.slice(0, 2).map((scene, index) => index === 1 ? {...scene, startFrame: 300, durationInFrames: 150} : scene)}, script: {...exampleProps.script, scenes: exampleProps.script.scenes.slice(0, 2)}, captions: exampleProps.captions.filter((caption) => caption.startMs < 15000)};
