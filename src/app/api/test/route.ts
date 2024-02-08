// https://qabo-ahha.mushroomtrack.com/hls/nCoZCJWZehw0QNnUvp-mqQ/1707347801/0/18/18.m3u8
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get("url") || ""
  const res = await fetch(url)
  let body = await res.text()
  //   181123.ts
  // #EXTINF:7.774433,
  // 181124.ts
  // #EXTINF:6.573233,
  // 181125.ts
  // #EXTINF:8.341667,
  // 181126.ts
  // #EXTINF:8.641967,
  // 181127.ts
  // #EXTINF:3.970633,
  // 181128.ts
  //   #EXT - X - ENDLIST
  //   把 檔案裡所有.ts 都改成 https://qabo-ahha.mushroomtrack.com/hls/nCoZCJWZehw0QNnUvp-mqQ/1707347801/0/18/{file}.ts
  //   const tsFiles = body.match(/(\d+\.ts)/g)
  //   if (tsFiles) {
  //     tsFiles.forEach((file) => {
  //       body = body.replace(
  //         file,
  //         `https://qabo-ahha.mushroomtrack.com/hls/nCoZCJWZehw0QNnUvp-mqQ/1707347801/0/18/${file}`
  //       )
  //     })
  //   }

  return new Response(body, {
    headers: {
      "content-type": "application/x-mpegURL"
    }
  })
}
