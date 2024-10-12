import { expect, test } from "vitest";
import { fetchPage } from "./utils";

test("should fetch url", async () => {
  const r = await fetchPage("https://www.lanzouo.com/b0ufrtlc");
  expect(r.isOk).toBeTruthy();
  expect(r.unwrap()).includes("filemoreajax.php?file=851982");

  const r2 = await fetchPage("https://lanzoui.com/i8tbj0h");
  expect(r2.isOk).toBeTruthy();
  expect(r2.unwrap()).includes('<iframe class="ifr2"');
});
