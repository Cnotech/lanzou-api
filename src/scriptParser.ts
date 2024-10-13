import RJson from "relaxed-json";

export function parseScriptBlock(text: string) {
  // 匹配 ajax 块
  const blocks: string[] = [];
  let stack = 0;
  let insideAjaxBlock = false;
  let buf = "";

  const lines = text.split("\n");
  const identifiersValue: Record<string, string> = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 标识符值动态解析
    const declM = line.match(/var\s+([_\w]+);?/);
    if (declM) {
      const [_, key] = declM;
      identifiersValue[key] = "null";
    }
    const exprM = line.match(/([_\w]+)\s*=\s*(['"]?[_\w]+['"]?)\s*;?/);
    if (exprM) {
      const [_, key, value] = exprM;
      identifiersValue[key] = value;
    }
    const varM = line.match(/var\s+([_\w]+)\s*=\s*(['"]?[_\w]+['"]?)\s*;?/);
    if (varM) {
      const [_, key, value] = varM;
      identifiersValue[key] = value;
    }

    // 处理开头匹配
    if (line.startsWith("$.ajax(")) {
      if (insideAjaxBlock) {
        throw new Error("Fatal: Unclosed ajax block");
      }
      insideAjaxBlock = true;
      buf = line;
    }
    // 处理花括号堆栈
    for (const c of line) {
      if (c === "{") {
        stack++;
      }
      if (c === "}") {
        stack--;
      }
    }
    if (insideAjaxBlock) {
      // 添加行
      buf += line + "\n";
      // 处理结尾
      if (stack === 0) {
        insideAjaxBlock = false;
        blocks.push(buf);
      }
    }
  }

  return { blocks, identifiersValue };
}

// 输入被 parseScriptBlock 拆分后的 ajax 申明 block
// 返回请求使用的 url 和 data
export function parseRequestCtx(
  text: string,
  {
    pwd,
    identifiersValue,
  }: { pwd?: string; identifiersValue: Record<string, string> },
) {
  // 匹配 url
  const m = text.match(/url\s*:\s*['"]([/\w.?=]+)['"]/);
  if (!m) {
    throw new Error(`Fatal: Invalid ajax block : no url field matched`);
  }
  const url = m[1];

  // 匹配 data
  let dataText = "";
  let insideBlock = false;
  for (const _line of text.split("\n")) {
    const line = _line.trim();
    // 遇到注释
    if (line.startsWith("//")) continue;
    // 遇到 data 申明开头
    if (/data\s*:\s*{/.test(line)) {
      // 特殊处理整个对象都在一行内的
      if (line.endsWith("},")) {
        dataText = line
          .replace(/data\s*:\s*/, "")
          .replace(/,/g, ",\n")
          .trim();
        if (dataText.endsWith(",")) dataText = dataText.slice(0, -1);
        if (dataText.startsWith("{")) dataText = dataText.slice(1);
        if (dataText.endsWith("}")) dataText = dataText.slice(0, -1);
        dataText = `{\n${dataText.trim()}\n}`;
        // console.log(dataText);
        break;
      }
      insideBlock = true;
      dataText = "{\n";
      continue;
    }
    if (insideBlock) {
      // 遇到结束的花括号
      if (line.startsWith("}")) {
        insideBlock = false;
        dataText += "}";
      }
      // 添加行
      dataText += line + "\n";
    }
  }
  if (insideBlock) {
    throw new Error(`Fatal: Unclosed data field block`);
  }
  if (!dataText) {
    throw new Error(`Fatal: Invalid ajax block : data field not matched`);
  }
  dataText = dataText.replace(/'/g, '"').trim();
  // console.log(dataText);

  const getValue = (identifier: string) => {
    if (identifier === "pwd") return `"${pwd}"`;
    const v = identifiersValue[identifier];
    if (!v) {
      throw new Error(
        `Fatal: Can't find identifier '${identifier}' declare line`,
      );
    }
    return v;
  };
  // 填充申明的变量值
  let buf = "{";
  for (const _line of dataText.split("\n")) {
    let line = _line.trim();
    if (!line.endsWith(",")) line = `${line},`;
    if (!line.includes(":")) continue;
    // 值为字符串
    if (line.endsWith("',") || line.endsWith('",')) {
      buf += line;
      continue;
    }
    // 值可能为 number 或标识符，需要进一步匹配判断
    const m = line.match(/['"]?([\w_]+)['"]?\s*:\s*([\w_]+),?/);
    if (!m) {
      throw new Error(`Can't match key and value in line '${line}'`);
    }
    const [_, key, value] = m;
    // 如果是数字，直接放行
    if (Number.isFinite(Number(value))) {
      buf += line;
      continue;
    }
    // 标识符需要替换
    const trueValue = getValue(value);
    buf += `${key}:${trueValue},`;
  }
  buf += "}";
  buf = buf.replace(/'/g, '"');

  // 解析 data 对象获取 json
  console.log(114, buf, 514);
  const data = RJson.parse(buf);

  return { url, data };
}
