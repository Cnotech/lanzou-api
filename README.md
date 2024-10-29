# Lanzou API for Nodejs

## 用法
> 注意：当前的 API 实现并不完善，在之后的版本中用法会有破坏性变化

解析文件分享
```ts
import { loadShareUrl } from "lanzou-api";

const data = (await loadShareUrl("https://lanzoui.com/i8tbj0h")).unwrap();

if (data.type === "file") {
  console.log(data.downloadUrl);
}
```

解析带密码的文件夹分享
```ts
import { loadShareUrl } from "lanzou-api";

// 加载文件夹列表
const res = await loadShareUrl("https://yuandan.lanzouw.com/b02clwpxg","a765");
if (res.isErr()) {
  throw new Error(res.unwrapErr());
}
const data = res.unwrap();

if (data.type === "folder"){
  // 查找需要下载的文件
  const fileNode = data.nodes.find(n => n.name === "咬钩.txt");
  // 二次加载具体文件的分享链接
  if (fileNode?.shareUrl){
    const r = (await loadShareUrl(fileNode.shareUrl)).unwrap();
    if (r.type === "file") {
      console.log(r.downloadUrl);
    }
  }
}
```

## 测试链接
- 旧版文件分享：https://lanzoui.com/i8tbj0h
- 新版文件带密码分享：https://wws.lanzoui.com/tp/iDUSepvqibg 密码：dntj
- 旧版文件夹分享：https://www.lanzouo.com/b0ufrtlc
- 新版文件夹分享：https://zykeji.lanzoui.com/b02k546mf
- 旧版文件夹带密码分享：https://yuandan.lanzouw.com/b02clwpxg 密码：a765
- 新版文件夹带密码分享：https://lanzoui.com/b481564 密码：a08l （超长文件列表）

## TODO
- 支持嵌套文件夹分享（缺少带密码的嵌套文件夹分享示例）
- 支持超长列表翻页
