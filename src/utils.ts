import { Err, Ok, Result } from "ts-results-es";

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
