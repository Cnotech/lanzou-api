import { Err, Ok, Result } from "ts-results-es";
import { FileMoreRes, FileNodeRaw } from "./types";
import { fetchDirectLink } from "./utils";

export async function fileMoreApi({
  shareUrl,
  apiPayload,
  apiPath,
}: {
  shareUrl: string;
  apiPath: string;
  apiPayload: unknown;
}): Promise<Result<FileMoreRes, string>> {
  const urlInstance = new URL(shareUrl);

  // 向 api 发起请求
  const apiUrl = `${urlInstance.origin}${apiPath}`;
  const body = new FormData();
  for (const [key, value] of Object.entries(
    apiPayload as Record<string, string>,
  )) {
    body.append(key, value?.toString() ?? "");
  }
  console.log(
    `Info: Fetching '${apiUrl}' with payload '${JSON.stringify(apiPayload)}'`,
  );
  const r = await fetch(apiUrl, {
    method: "POST",
    body,
    headers: {
      origin: urlInstance.origin,
      referrer: shareUrl,
    },
  });
  const json: {
    zt: number;
    dom?: string;
    inf?: string;
    info?: string;
    url?: number;
    text?: FileNodeRaw[];
  } = await r.json();
  console.log(`Info: Response json : \n${JSON.stringify(json, null, 2)}`);
  const info = json.inf || json.info || "NO_INFO_RETURNED";
  if (json.zt !== 1) {
    return new Err(
      `Error: Lanzou api returned error status '${json.zt}' : '${info}'`,
    );
  }

  // 文件
  if (!json.text && json.dom && json.url) {
    return new Ok({
      type: "file",
      name: info,
      downloadUrl: await fetchDirectLink(`${json.dom}/file/${json.url}`),
    });
  }

  // 文件夹
  if (json.text) {
    // 过滤掉推广内容
    const fileNodes = json.text.filter(({ t }) => t !== 1);
    return new Ok({
      type: "folder",
      nodes: fileNodes.map((n) => ({
        ...n,
        shareUrl: `${urlInstance.origin}/${n.id}`,
      })),
    });
  }

  // 兜底，无法识别的类型
  return new Err(`Error: Failed to judge share type for '${shareUrl}'`);
}
