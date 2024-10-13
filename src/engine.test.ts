import { expect, test } from "vitest";
import { ShareType } from "./types";
import { loadShareUrl } from "./engine";

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
  for (const { url, pwd } of TESTING_TUPLES) {
    console.log(`Info: Testing '${url}'`);
    const r = await loadShareUrl(url, pwd);
    expect(r.isOk).toBeTruthy();
    console.log(JSON.stringify(r.unwrap(), null, 2));
    // expect(r.unwrap()).toEqual([])
  }
});
