'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import ReactVideoPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import screenfull from 'screenfull';

import { VideoPlayerControl } from './video-player-control';
import { cn } from '@lib/cn';
import { Play } from '@components/icons/player';

type VideoPlayerProps = {
  url: string;
  thumbnail?: string;
};

function PlayButton() {
  return (
    <button
      aria-label="Video Play Button"
      className="bg-accent z-20 h-20 w-20 shadow-lg group/actionIcon rounded-full border-2 flex items-center justify-center border-white duration-200 hover:bg-accent-hover"
    >
      <Play className="w-8 -mr-[3px] duration-200 group-hover/actionIcon:text-white h-auto text-white" />
    </button>
  );
}

export function VideoPlayer({ url, thumbnail }: VideoPlayerProps) {
  const videoPlayerRef = useRef(null);
  const videoPlayerWrapperRef = useRef(null);
  const [thumbnailVisibility, setThumbnailVisibility] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [videoSliderProgress, setVideoSliderProgress] = useState<number>(0);
  const [seeking, setSeeking] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const playPauseHandler = () => {
    setPlaying((prev) => !prev);
  };

  function volumeChangeHandler(value: number) {
    setVolume(value / 100);
  }

  function handleMuteUnmute() {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.5);
    }
  }

  const handleVideoProgressChange = useCallback((value: number) => {
    setVideoSliderProgress(value);
    setSeeking(true);
    // @ts-ignore
    videoPlayerRef?.current?.seekTo(value / 100);
  }, []);

  const handleVideoProgressAfterChange = useCallback((value: number) => {
    setVideoSliderProgress(value);
  }, []);

  function handleOnProgress(props: OnProgressProps) {
    if (!seeking) {
      setVideoSliderProgress(() => (props.playedSeconds / videoDuration) * 100);
    }
  }

  const handleFullScreen = useCallback(() => {
    screenfull.toggle(videoPlayerWrapperRef.current!);
    screenfull.on('change', () => {
      setIsFullscreen(screenfull.isFullscreen);
    });
  }, []);

  const handleOnEnded = useCallback(() => {
    setPlaying(false);
    setThumbnailVisibility(true);
  }, []);

  return (
    <div
      ref={videoPlayerWrapperRef}
      className={cn(
        'flex z-10 group rounded-xl flex-col relative lg:overflow-hidden',
        isFullscreen && 'rounded-none',
      )}
    >
      <div
        className={cn(
          'w-full aspect-video group bg-black relative rounded-t-xl lg:rounded-none overflow-hidden',
          isFullscreen &&
            '!rounded-none h-full flex items-center justify-center',
        )}
      >
        <ReactVideoPlayer
          ref={videoPlayerRef}
          url={url}
          controls={false}
          light={true}
          width="100%"
          height="100%"
          playIcon={<PlayButton />}
          onReady={() => setPlaying(true)}
          onDuration={(d) => setVideoDuration(d)}
          playing={playing}
          volume={volume}
          onProgress={handleOnProgress}
          onBufferEnd={() => setSeeking(false)}
          onEnded={handleOnEnded}
          onStart={() => setThumbnailVisibility(false)}
          onPlay={() => setThumbnailVisibility(false)}
          className="object-contain w-full h-full"
        />
        {thumbnail && !playing ? (
          <div
            className={cn(
              'absolute w-full h-full visible left-0 top-0 duration-300 opacity-100 z-10',
              !thumbnailVisibility && 'opacity-0 invisible',
              isFullscreen && 'opacity-0 invisible',
            )}
          >
            <Image
              src={thumbnail}
              alt="video thumbnail"
              fill
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>
      {isFullscreen && (
        <span className="absolute peer z-10 bottom-0 left-0 w-full h-[100px]" />
      )}
      <div
        className={cn(
          'rounded-b-xl lg:absolute z-20 -bottom-full duration-500 left-0 right-0 w-full bg-[#1F2937] text-white sm:px-5 px-3 2xl:px-6 pt-2.5 2xl:pt-4 pb-2.5 sm:pb-3.5 2xl:pb-5 hover:bottom-0',
          isFullscreen
            ? 'peer-hover:bottom-0 rounded-b-none'
            : 'group-hover:bottom-0',
        )}
      >
        <VideoPlayerControl
          videoSliderProgress={videoSliderProgress}
          playing={playing}
          handleVideoProgressChange={handleVideoProgressChange}
          handleVideoProgressAfterChange={handleVideoProgressAfterChange}
          playPauseHandler={playPauseHandler}
          handleMuteUnmute={handleMuteUnmute}
          volume={volume}
          volumeChangeHandler={volumeChangeHandler}
          handleFullScreen={handleFullScreen}
          videoDuration={videoDuration}
          isFullscreen={isFullscreen}
        />
      </div>
    </div>
  );
}
