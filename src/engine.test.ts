import { beforeEach, describe, expect, test, vi } from "vitest";
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
const logs: string[] = [];
describe("engine", () => {
  beforeEach(() => {
    vi.mock("./log", async () => {
      return {
        log: (text: string) => logs.push(text),
      };
    });
  });
  test("engine and judge utils", async () => {
    // 执行测试
    for (const { url, pwd } of TESTING_TUPLES) {
      // eslint-disable-next-line no-console
      console.log(`Info: Testing '${url}'`);
      const r = await loadShareUrl(url, pwd);
      expect(r.isOk).toBeTruthy();
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(r.unwrap(), null, 2));
      // expect(r.unwrap()).toEqual([])
    }
    // 断言控制台打印中没有 Warning
    expect(logs.length).toBeTruthy();
    expect(logs.find((t) => t.startsWith("Warning"))).toBeFalsy();
  });
});
