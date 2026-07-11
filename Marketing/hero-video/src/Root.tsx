import { Composition } from "remotion";
import { LocalBusinessHero } from "./LocalBusinessHero";

export const VIDEO_FPS = 30;
export const VIDEO_SECONDS = 19;
export const VIDEO_DURATION = VIDEO_FPS * VIDEO_SECONDS;

export const RemotionRoot = () => {
  return (
    <Composition
      id="LocalBusinessHero"
      component={LocalBusinessHero}
      durationInFrames={VIDEO_DURATION}
      fps={VIDEO_FPS}
      width={1920}
      height={1080}
    />
  );
};
