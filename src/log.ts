const isDev = process.env.NODE_ENV === "dev";

export function log(text: string) {
  // eslint-disable-next-line no-console
  if (isDev) console.log(text);
}
