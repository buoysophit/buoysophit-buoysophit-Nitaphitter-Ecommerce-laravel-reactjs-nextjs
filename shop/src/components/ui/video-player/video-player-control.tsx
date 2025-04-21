import { formatTime } from './video-player-utils';
import RangeSlider from './range-slider';
import {
  Fullscreen,
  FullscreenExit,
  Mute,
  Pause,
  Play,
  Speaker,
} from '@components/icons/player';

type ControlProps = {
  videoSliderProgress: number;
  playing: boolean;
  handleVideoProgressChange: (value: number) => void;
  handleVideoProgressAfterChange: (value: number) => void;
  playPauseHandler: () => void;
  handleMuteUnmute: () => void;
  volume: number;
  volumeChangeHandler: (value: number) => void;
  handleFullScreen: () => void;
  isFullscreen: boolean;
  videoDuration: number;
};

export function VideoPlayerControl({
  videoSliderProgress,
  playing,
  handleVideoProgressChange,
  handleVideoProgressAfterChange,
  playPauseHandler,
  handleMuteUnmute,
  volume,
  volumeChangeHandler,
  handleFullScreen,
  isFullscreen,
  videoDuration,
}: ControlProps) {
  return (
    <>
      <div className="flex gap-10 2xl:mb-3 sm:mb-2 mb-1.5 justify-between">
        <div className="w-full ps-0.5">
          <RangeSlider
            value={videoSliderProgress}
            defaultValue={videoSliderProgress}
            step={0.01}
            // @ts-ignore
            onChange={handleVideoProgressChange}
            // @ts-ignore
            onChangeComplete={handleVideoProgressAfterChange}
            className={videoProgressRangeSliderClassName}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5 2xl:gap-6">
        <button
          aria-label="Video Play Button"
          onClick={playPauseHandler}
          className="outline-none w-auto h-auto bg-transparent hover:bg-transparent p-0"
        >
          {playing ? (
            <Pause className="2xl:w-6 w-3.5 sm:w-4 h-auto -ms-0.5 me-0.5" />
          ) : (
            <Play className="2xl:w-6 w-3 sm:w-4 h-auto" />
          )}
        </button>
        <div className="flex items-center gap-2 sm:gap-3 2xl:gap-4">
          <button
            onClick={handleMuteUnmute}
            aria-label="Volume Button"
            className="outline-none w-auto h-auto bg-transparent hover:bg-transparent p-0"
          >
            {volume > 0 ? (
              <Speaker className="2xl:w-6 w-3.5 sm:w-4 h-auto" />
            ) : (
              <Mute className="2xl:w-6 w-3.5 sm:w-4 h-auto" />
            )}
          </button>
          <div className="w-12 md:w-[100px]">
            <RangeSlider
              step={0.01}
              value={volume * 100}
              // @ts-ignore
              onChange={volumeChangeHandler}
              className={volumeSliderClassName}
            />
          </div>
        </div>
        <span className="select-none text-[10px] sm:text-xs 2xl:text-sm font-normal">
          {formatTime((videoDuration / 100) * videoSliderProgress)}
          &nbsp;/&nbsp;
          {formatTime(videoDuration)}
        </span>
        <button
          aria-label="Video Fullscreen Button"
          className="ml-auto p-0 w-auto h-auto hover:bg-transparent bg-transparent border-0 outline-none"
          onClick={handleFullScreen}
        >
          {isFullscreen ? (
            <FullscreenExit
              aria-label="Exit Fullscreen"
              className="w-3 sm:w-4 h-auto"
            />
          ) : (
            <Fullscreen
              aria-label="Enter Fullscreen"
              className="w-3 sm:w-4 h-auto"
            />
          )}
        </button>
      </div>
    </>
  );
}

const videoProgressRangeSliderClassName =
  '[&_.rc-slider-track]:bg-[#40C17B] [&_.rc-slider-track]:h-[2px] sm:[&_.rc-slider-track]:h-[3px] 2xl:[&_.rc-slider-track]:h-1 [&_.rc-slider-rail]:bg-[#111111] [&_.rc-slider-rail]:h-[2px] sm:[&_.rc-slider-rail]:h-[3px] 2xl:[&_.rc-slider-rail]:h-1  [&_.rc-slider-handle]:!border-[#40C17B] [&_.rc-slider-handle]:bg-[#40C17B] [&_.rc-slider-handle]:duration-300 [&_.rc-slider-handle]:border-[2px] [&_.rc-slider-handle]:w-2 [&_.rc-slider-handle]:h-2 sm:[&_.rc-slider-handle]:w-3 sm:[&_.rc-slider-handle]:h-3 [&_.rc-slider-handle]:hover:!border-[#40C17B] [&_.rc-slider-handle]:-mt-[3px] sm:[&_.rc-slider-handle]:-mt-[5px] 2xl:[&_.rc-slider-handle]:!-mt-1 [&_.rc-slider-handle]:active:![box-shadow:0_2px_6px_rgba(255,_255,_255,_0.12)] [&_.rc-slider-handle]:shadow-xl [&_.rc-slider-handle]:transition-colors';
const volumeSliderClassName =
  '[&_.rc-slider-track]:bg-[#fff] [&_.rc-slider-track]:h-[2px] sm:[&_.rc-slider-track]:h-[3px] 2xl:[&_.rc-slider-track]:h-1 [&_.rc-slider-rail]:bg-[#111111] [&_.rc-slider-rail]:h-[2px] sm:[&_.rc-slider-rail]:h-[3px] 2xl:[&_.rc-slider-rail]:h-1  [&_.rc-slider-handle]:!border-[#fff] [&_.rc-slider-handle]:bg-[#fff] [&_.rc-slider-handle]:duration-300 [&_.rc-slider-handle]:border-[2px] [&_.rc-slider-handle]:w-2 [&_.rc-slider-handle]:h-2 sm:[&_.rc-slider-handle]:w-3 sm:[&_.rc-slider-handle]:h-3 [&_.rc-slider-handle]:hover:!border-[#fff] [&_.rc-slider-handle]:-mt-[3px] sm:[&_.rc-slider-handle]:-mt-[5px] 2xl:[&_.rc-slider-handle]:!-mt-1 [&_.rc-slider-handle]:active:![box-shadow:0_2px_6px_rgba(255,_255,_255,_0.12)] [&_.rc-slider-handle]:shadow-xl [&_.rc-slider-handle]:transition-colors';
