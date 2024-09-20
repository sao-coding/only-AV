import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import puppeteer from "puppeteer"

export const GET = async (req: NextRequest) => {
  // req.nextUrl.searchParams
  const id = req.nextUrl.searchParams.get("id")
  const type = req.nextUrl.searchParams.get("type")
  // <section class="video-info pb-3">
  // <div class="info-header">
  // <div class="header-left">
  // <h4>NIMA-025 実写版！茜色に染まる若妻 前編後編～病室で僕の妻が寝取られた～ 美園和花</h4>
  // <h6>
  // <svg class="mr-2" height="16" width="16"><use xlink:href="#icon-clock"></use></svg>
  // <span class="mr-3">1 天前</span>
  // <svg class="mr-2" height="16" width="16"><use xlink:href="#icon-eye"></use></svg>
  // <span class="mr-3">199 353</span>
  // <div class="models">
  // <a class="model" href="https://jable.tv/models/waka-misono/">
  // <img class="avatar rounded-circle" src="https://assets-cdn.jable.tv/contents/models/660/s1_waka-misono.jpg" width="24" height="24" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="美園和花">
  // </a>
  // </div>
  // </h6>
  // </div>
  // <div class="header-right d-none d-md-block">
  // <h6>
  // <span class="text-danger fs-1 mr-2">●</span>高清原片
  // </h6>
  // <span class="inactive-color">上市於 2024-02-07</span>
  // </div>
  // </div>
  // <div class="text-center">
  // <a class="text-sponsor" target="_blank" href="https://tsyndicate.com/api/v1/direct/859d1d9a53ed42659323b5291bbbcbcc">免費視頻裸聊！性感美女讓你秒射到爆</a>
  // <style>
  // .text-sponsor::before {
  //     content: '♥';
  //     color: #6eada3;
  //     font-size: 12px;
  //     font-weight: 400;
  //     margin-right: 1px;
  // }
  // </style>
  // <div class="my-3">
  // <button data-fancybox="ajax" data-href="https://jable.tv/login-required/" class="btn btn-action fav mr-2">
  // <svg class="mr-2" height="18" width="16"><use xlink:href="#icon-heart"></use></svg><span class="count">1929</span>
  // </button>
  // <button data-fancybox="ajax" data-href="https://jable.tv/login-required/" class="btn btn-action">
  // <svg height="18" width="16"><use xlink:href="#icon-bookmark-inline"></use></svg>
  // </button>
  // <button class="btn btn-action" data-toggle="dropdown">
  // <svg height="18" width="16"><use xlink:href="#icon-more-horizontal"></use></svg>
  // </button>
  // <div class="dropdown-menu">
  // <a data-fancybox="" data-src="#flag-form" href="javascript:;" class="dropdown-item">問題回報</a>
  // </div>
  // </div>
  // <h5 class="tags h6-md">
  // <a href="https://jable.tv/categories/roleplay/" class="cat">角色劇情</a>
  // <span class="separator">•</span>
  // <a href="https://jable.tv/tags/girl/">少女</a>
  // <a href="https://jable.tv/tags/creampie/">中出</a>
  // <a href="https://jable.tv/tags/wife/">人妻</a>
  // <a href="https://jable.tv/tags/affair/">出軌</a>
  // <a href="https://jable.tv/tags/cum-in-mouth/">口爆</a>
  // <a href="https://jable.tv/tags/Cosplay/">Cosplay</a>
  // </h5>
  // <iframe class="na" frameborder="0" scrolling="no" width="728" height="90" sandbox="allow-scripts allow-popups allow-forms allow-same-origin" src="//a.labadena.com/api/spots/220808?p=1&amp;s1=%subid1%&amp;kw=" y58y7u5cl=""></iframe>
  // </div>
  // </section>
  // 爬蟲
  // 獲取 封面圖
  // 獲取標題
  // 獲取 m3u8 內容
  // 獲取 vtt 內容

  const crawlerHtml = async (url: string) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--user-agent=Mozilla/5.0"]
    })
    const page = await browser.newPage()
    await page.goto(url)
    const content = await page.content()
    console.log({ content })
    const $ = cheerio.load(content)
    await browser.close()
    // 獲取封面圖 video 標籤 屬性 poster
    const coverUrl = $("#site-content video").attr("poster")
    console.log({ coverUrl })
    const title = $(".info-header h4").text()
    console.log({ title })
    // const scriptHtml = $("script").eq(8).html()
    // console.log({ scriptHtml })
    // 獲取 div id site-content 底下 第二個 script
    const scriptHtml = $("#site-content script").eq(1).html()
    // console.log({ scriptHtml })
    const hlsUrlMatch = scriptHtml && scriptHtml.match(/var hlsUrl = '(.+)';/)
    const vttUrlMatch = scriptHtml && scriptHtml.match(/var vttUrl = '(.+)';/)
    const hlsUrl = hlsUrlMatch && hlsUrlMatch[1]
    const vttUrl = vttUrlMatch && vttUrlMatch[1]
    console.log({ coverUrl, title, hlsUrl, vttUrl })
    return { coverUrl, title, hlsUrl, vttUrl }
  }

  // 載入封面圖

  if (type === "data") {
    const { coverUrl, title } = await crawlerHtml(`https://jable.tv/videos/${id}/`)
    if (!coverUrl || !title) {
      return new Response("Not Found", { status: 404 })
    }
    return NextResponse.json({ title, cover: coverUrl })
  }

  if (type === "m3u8") {
    const { hlsUrl } = await crawlerHtml(`https://jable.tv/videos/${id}/`)
    if (!hlsUrl) {
      return new Response("Not Found", { status: 404 })
    }
    const res = await fetch(hlsUrl)
    const body = await res.text()
    // 若有 cookie hlsUrl 就更新
    // 先刪除
    cookies().delete("hlsUrl")
    // 再添加
    cookies().set("hlsUrl", hlsUrl)
    return new Response(body, {
      headers: {
        "content-type": "application/x-mpegURL"
      }
    })
  }

  if (type === "vtt") {
    const { vttUrl } = await crawlerHtml(`https://jable.tv/videos/${id}/`)
    if (!vttUrl) {
      return new Response("Not Found", { status: 404 })
    }
    const res = await fetch(vttUrl)
    const body = await res.text()
    return new Response(body, {
      headers: {
        "content-type": "text/vtt"
      }
    })
    // return new Response(vttUrl, {
    //   headers: {
    //     "content-type": "text/vtt"
    //   }
    // })
  }
}
