import Player from "@/components/player/player"

const Home = () => {
  return (
    <div className='mx-auto max-w-5xl'>
      <h1>Home</h1>
      <Player
        coverUrl='https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=1200'
        title='Sprite Fight'
        hlsUrl='https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU.m3u8'
        vttUrl='https://media-files.vidstack.io/sprite-fight/chapters.vtt'
      />
    </div>
  )
}

export default Home
