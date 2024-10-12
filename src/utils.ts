import { Err, Ok, Result } from "ts-results-es";
import { CheerioAPI, load } from "cheerio";
import { ShareType } from "./types";

export async function fetchPage(url: string): Promise<Result<string, string>> {
  try {
    const res = await fetch(url);
    const t = await res.text();
    return new Ok(t);
  } catch (e) {
    return new Err(
      `Error: Failed to fetch url '${url}' : ${JSON.stringify(e)}`,
    );
  }
}

export function isFileOrFolder($: CheerioAPI): Result<ShareType, string> {
  if ($("div#infomores").text().includes("更多")) {
    return new Ok("folder");
  }
  if ($("head > meta:nth-child(4)").attr("content")?.includes("文件大小")) {
    return new Ok("file");
  }
  return new Err("Error: Failed to judge file or folder");
}

export function isPasswordRequired($: CheerioAPI): boolean {
  return !!$("input#pwd").length;
}
