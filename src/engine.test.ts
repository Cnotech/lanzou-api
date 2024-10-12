import { expect, test } from "vitest";
import { isFileOrFolder, isPasswordRequired } from "./utils";
import { ShareType } from "./types";
import { loadShareUrl } from "./engine";
import { load } from "cheerio";

const TESTING_TUPLES: { url: string; pwd?: string; type: ShareType }[] = [
  {
    url: "https://lanzoui.com/i8tbj0h",
    type: "file",
  },
  {
    url: "https://wws.lanzoui.com/tp/iDUSepvqibg",
    type: "file",
    pwd: "dntj",
  },
  {
    url: "https://www.lanzouo.com/b0ufrtlc",
    type: "folder",
  },
  {
    url: "https://zykeji.lanzoui.com/b02k546mf",
    type: "folder",
  },
  {
    url: "https://yuandan.lanzouw.com/b02clwpxg",
    type: "folder",
    pwd: "a765",
  },
  {
    url: "https://lanzoui.com/b481564",
    type: "folder",
    pwd: "a08l",
  },
];

test("engine and judge utils", async () => {
  for (const { url, type, pwd } of TESTING_TUPLES) {
    console.log(`Info: Testing '${url}'`);
    const r = await loadShareUrl(url, pwd);
    expect(r.isOk).toBeTruthy();
    const $ = load(r.unwrap());
    expect(isFileOrFolder($).unwrap()).toEqual(type);
    expect(isPasswordRequired($)).toEqual(!!pwd);
  }
});
