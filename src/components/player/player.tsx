"use client"
import React from "react"
import { toast } from "sonner"

import {
  MediaCanPlayDetail,
  MediaCanPlayEvent,
  MediaPlayer,
  MediaProvider,
  Poster
} from "@vidstack/react"

import VideoLayout from "./layouts/video-layout"

import "@vidstack/react/player/styles/base.css"

const Player = ({
  title,
  coverUrl,
  hlsUrl,
  vttUrl
}: {
  title: string
  coverUrl: string
  hlsUrl: string
  vttUrl: string
}) => {
  // const player = React.useRef<MediaPlayerInstance>(null)
  // console.log({ hlsUrl, vttUrl })
  // function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
  //   // ...
  // }

  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    toast.loading("影片載入中...", { id: "loading" })
  }, [])
  const onCanPlay = (detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) => {
    // console.log({ detail, nativeEvent })
    setIsLoading(false)
    toast.success("影片載入完成", { id: "loading" })
  }
  return (
    <>
      <MediaPlayer
        id='player'
        className='aspect-video w-full overflow-hidden rounded-md bg-slate-700 font-sans text-white ring-media-focus data-[focus]:ring-4'
        // className={cx(
        //   "aspect-video w-full overflow-hidden rounded-md bg-slate-700 font-sans text-white ring-media-focus data-[focus]:ring-4",
        //   isLoading ? "animate-pulse" : ""
        // )}
        title={title}
        // src='https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8'
        // src = { src: "https://example.com/hls", type: "application/x-mpegurl" }
        // src={{ src: "http://localhost:3000/api/test", type: "video/mpegurl" }}
        src={{
          src: hlsUrl,
          type: "video/mpegurl"
        }}
        // crossOrigin
        playsInline
        // onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        // ref={player}
      >
        <MediaProvider>
          <Poster
            className='absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100'
            src={coverUrl}
            alt={title}
          />
          {/* <Track
            src='https://media-files.vidstack.io/sprite-fight/chapters.vtt'
            kind='chapters'
            language='en-US'
            default
          /> */}
        </MediaProvider>
        <VideoLayout thumbnails={vttUrl} />
      </MediaPlayer>
    </>
  )
}

export default Player
