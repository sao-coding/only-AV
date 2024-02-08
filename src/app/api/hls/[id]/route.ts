import { cookies } from "next/headers"
import { NextRequest } from "next/server"
export const dynamic = "force-dynamic"
export const GET = async (req: NextRequest) => {
  // https://qabo-ahha.mushroomtrack.com/hls/PUvGIOVQIT5WwaTpjok-_Q/1707383105/0/18/180.ts
  // 目前 path 是 /api/test/123.ts 替換成 https://qabo-ahha.mushroomtrack.com/hls/PUvGIOVQIT5WwaTpjok-_Q/1707383105/0/18/180.ts
  const path = req.nextUrl.pathname.replace("/api/hls", "")
  // 獲取 hlsurl cookie
  // https://qabo-ahha.mushroomtrack.com/hls/CHCp9FB-TJalfuMGNqc1Kg/1707388401/0/18/{xx}.m3u8
  // 刪除 xxx.m3u8
  const hlsUrl = cookies()
    .get("hlsUrl")
    ?.value.replace(/\/[^/]+\.m3u8$/, "")
  console.log({ path, hlsUrl })
  if (!hlsUrl) {
    return new Response("Not Found", { status: 404 })
  }
  const res = await fetch(
    `${hlsUrl}/${path}`,
    {
      cache: "no-store"
    }
    // {
    //   headers: {
    //     referer: "https://jable.tv/",
    //     "Content-Type": "video/mp2t"
    //   }
    // }
  )
  // 把獲取到的.ts檔案 Response 回去
  // const body = await res.blob()
  // console.log(body)

  return new Response(res.body, {
    headers: {
      "content-type": "video/mp2t"
    }
  })
}
