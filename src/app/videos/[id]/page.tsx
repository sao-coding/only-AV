import Video from "./video"

const VideoPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Video id={params.id} />
    </>
  )
}

export default VideoPage
