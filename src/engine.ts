// 支持密码输入和重定向
import { Err, Ok, Result } from "ts-results-es";
import { fetchPage, isPasswordRequired } from "./utils";
import { load } from "cheerio";
import { parseRequestCtx, parseScriptBlock } from "./scriptParser";
import { fileMoreApi } from "./api";
import { FileMoreRes } from "./types";
import { log } from "./log";

export async function loadShareUrl(
  url: string,
  pwd?: string,
): Promise<Result<FileMoreRes, string>> {
  const urlInstance = new URL(url);
  // 直接加载页面
  const initialPageRes = await fetchPage(url);
  if (initialPageRes.isErr()) {
    return initialPageRes;
  }
  let htmlText = initialPageRes.unwrap();

  // 处理重定向
  const m = htmlText.match(
    /<script>window\.location\.href='(\/\w+\?p)';<\/script>/,
  );
  if (m?.length) {
    const [_, nextPath] = m;
    const nextUrl = `${urlInstance.origin}${nextPath}`;
    log(`Info: Redirected to ${nextUrl}`);
    const r = await fetchPage(nextUrl);
    if (r.isErr()) {
      return r;
    }
    htmlText = r.unwrap();
  }
  let $ = load(htmlText);
  const htmlTitle = $("body > div.d > div:nth-child(1)").text();

  // 对于旧版文件分享页面，使用 iframe 的网页源码
  const iframeQ = $("iframe");
  if (iframeQ.length) {
    const src = iframeQ.first().attr("src")?.toString();
    const requestUrl = `${urlInstance.origin}${src ?? ""}`;
    const fRes = await fetchPage(requestUrl);
    if (fRes.isErr()) {
      return fRes;
    }
    log(`Info: Use html source from '${requestUrl}'`);
    htmlText = fRes.unwrap();
    $ = load(htmlText);
  }

  // 解析出所有的 ajax 函数
  let ajaxContexts: { url: string; data: unknown }[] = [];
  try {
    const { blocks, identifiersValue } = parseScriptBlock(htmlText);
    ajaxContexts = blocks.map((t) =>
      parseRequestCtx(t, { pwd, identifiersValue }),
    );
  } catch (e) {
    return new Err(`Error: Failed to parse ajax blocks: ${e}`);
  }

  // 检查密码
  if (isPasswordRequired($) && !pwd) {
    return new Err(
      `Error: Page '${url}' requires password, provide it with field 'pwd'`,
    );
  }

  // 筛选出文件加载的 ajax 块
  const loadFileAjax = ajaxContexts.find(
    ({ url }) => url.includes("ajaxm.php") || url.includes("filemoreajax.php"),
  );
  if (!loadFileAjax) {
    return new Err(`Error: Failed to find ajax block for files loading`);
  }

  // 请求文件加载 API
  const res = await fileMoreApi({
    shareUrl: url,
    apiPath: loadFileAjax.url,
    apiPayload: loadFileAjax.data,
  });
  if (res.isErr()) {
    return res;
  }
  const apiRes = res.unwrap();

  // 补充缺失的文件名 - 对应旧版文件分享
  if (apiRes.type === "file" && apiRes.name === null && htmlTitle) {
    apiRes.name = htmlTitle;
  }

  return new Ok(res.unwrap());
}
