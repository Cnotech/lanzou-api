import { Err, Ok, Result } from "ts-results-es";
import { CheerioAPI } from "cheerio";
import { ShareType } from "./types";
import { existsSync } from "node:fs";
import { CACHE_DIR } from "./constants";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { log } from "./log";

const ENABLE_CACHE = false;

function calcMD5(text: string) {
  return createHash("md5").update(text).digest("hex");
}

export async function fetchPage(url: string): Promise<Result<string, string>> {
  log(`Info: Fetching page '${url}'`);
  if (ENABLE_CACHE && !existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR);
  }
  const md5 = calcMD5(url);
  const cachePath = join(CACHE_DIR, `${md5}.html`);
  if (ENABLE_CACHE && existsSync(cachePath)) {
    const h = await readFile(cachePath);
    return new Ok(h.toString());
  }
  try {
    const res = await fetch(url, {
      headers: getRandomIPHeader(),
    });
    const t = await res.text();
    if (ENABLE_CACHE) await writeFile(cachePath, t);
    return new Ok(t);
  } catch (e) {
    return new Err(
      `Error: Failed to fetch url '${url}' : ${JSON.stringify(e)}`,
    );
  }
}

export async function fetchDirectLink(rawDownloadUrl: string) {
  try {
    const r = await fetch(rawDownloadUrl, {
      method: "HEAD",
      redirect: "manual",
      headers: {
        ...getRandomIPHeader(),
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
    });
    if (r.status === 302) {
      const next = r.headers.get("location");
      if (next) return next;
      else
        log(
          `Warning: Failed to fetch direct link for '${rawDownloadUrl}' : 'location field not found in headers', fallback to raw url`,
        );
    } else {
      log(
        `Warning: Failed to fetch direct link for '${rawDownloadUrl}' : 'invalid status code ${r.status}', fallback to raw url`,
      );
    }
  } catch (e) {
    log(
      `Warning: Failed to fetch direct link for '${rawDownloadUrl}' : '${e}', fallback to raw url`,
    );
  }

  return rawDownloadUrl;
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

function generateRandomIPv4(): string {
  function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const parts: number[] = [];
  for (let i = 0; i < 4; i++) {
    parts.push(getRandomInt(0, 255));
  }

  return parts.join(".");
}

export function getRandomIPHeader() {
  const ip = generateRandomIPv4();
  return {
    "X-FORWARDED-FOR": ip,
    "CLIENT-IP": ip,
  };
}
