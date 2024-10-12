// 支持密码输入和重定向
import { Ok, Result } from "ts-results-es";
import { fetchPage } from "./utils";

export async function loadShareUrl(
  url: string,
  pwd?: string,
): Promise<Result<string, string>> {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, nextPath] = m;
    const urlInstance = new URL(url);
    const nextUrl = `${urlInstance.origin}${nextPath}`;
    console.log(`Info: Redirected to ${nextUrl}`);
    const r = await fetchPage(nextUrl);
    if (r.isErr()) {
      return r;
    }
    htmlText = r.unwrap();
  }

  // 输入密码

  return new Ok(htmlText);
}
