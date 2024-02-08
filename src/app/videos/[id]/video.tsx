"use client"

import React from "react"

import Player from "@/components/player/player"
import { useQuery } from "@tanstack/react-query"

const Video = ({ id }: { id: string }) => {
  //   const [title, setTitle] = React.useState("")
  //   const [cover, setCover] = React.useState("")

  //   React.useEffect(() => {
  //     const fetchVideo = async () => {
  //       const res = await fetch(`/api/hls/video?type=data&id=${id}`)
  //       const data = await res.json()
  //       setTitle(data.title)
  //       setCover(data.coverUrl)
  //     }
  //     fetchVideo()
  //   }, [id])
  type VideoData = {
    title: string
    cover: string
  }

  const {
    isLoading,
    isError,
    data: video
  } = useQuery<VideoData>({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await fetch(`/api/hls/video?type=data&id=${id}`)
      if (!res.ok) {
        console.error("Failed to load video")
        throw new Error("Failed to load video")
      }
      return res.json()
    }
  })

  //   "http://localhost:3000/api/hls/video?type=m3u8&id=ipx-238-c"
  return (
    <div className='flex h-screen w-full flex-col gap-4 text-white md:py-20'>
      {isLoading && (
        <>
          <div className='aspect-video w-full overflow-hidden rounded-3xl'>
            <div className='h-full w-full animate-pulse bg-slate-700' />
          </div>
          <h1 className='animate-pulse text-2xl'>載入中...</h1>
        </>
      )}
      {video && (
        <>
          <div className='aspect-video overflow-hidden rounded-3xl'>
            {
              <Player
                title={video.title}
                coverUrl={video.cover}
                hlsUrl={`/api/hls/video?type=m3u8&id=${id}`}
                vttUrl={`http://localhost:3000/api/hls/video?type=vtt&id=${id}`}
              />
            }
          </div>
          <h1 className='text-lg md:text-2xl'>{video.title}</h1>
        </>
      )}
      {isError && <div>Failed to load video</div>}
    </div>
  )
}

export default Video
