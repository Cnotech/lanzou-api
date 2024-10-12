import { expect, test } from "vitest";
import { fetchPage, isFileOrFolder } from "./utils";
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

test("should load share and judge type", async () => {
  for (const { url, type, pwd } of TESTING_TUPLES) {
    console.log(`Info: Processing '${url}'`);
    const r = await loadShareUrl(url, pwd);
    expect(r.isOk).toBeTruthy();
    // expect(r.unwrap()).includes(
    //   type === "file" ? '<iframe class="ifr2"' : "filemoreajax.php?file=",
    // );
    expect(isFileOrFolder(r.unwrap()).unwrap()).toEqual(type);
  }
});
