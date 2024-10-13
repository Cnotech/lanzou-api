import { expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import { parseRequestCtx, parseScriptBlock } from "./scriptParser";

const identifiersResult = {
  search_lock: "2",
  pwd: "null",
  pgs: "1",
  ib07i1: "'1728800082'",
  _gyjju: "'6e9819b869db8142100827f9f562f7bf'",
  // 下面的是解析错误的副作用，无关紧要
  alink: "n",
  class: "fileimg",
  data: "msg",
  date: "msg",
  display: '"none"',
  downstyle: "null",
  file: "851982'",
  file_ico: "null",
  file_time: "null",
  id: "ready",
  name_all: "n",
  qrcode: "new",
  str: "null",
  urls: "window",
  wd: "document",
};

test("parseScriptBlock", async () => {
  const text = (await readFile("demo/rc-firefox.js")).toString();
  const { blocks, identifiersValue } = parseScriptBlock(text);
  expect(blocks).toHaveLength(4);
  expect(blocks).toMatchSnapshot();
  expect(identifiersValue).toEqual(identifiersResult);
});

test("parseRequestCtx", () => {
  const block = `\t\t$.ajax({
\t\t\ttype : 'post',
\t\t\turl : '/filemoreajax.php?file=851982',
\t\t\tdata : { 
\t\t\t'lx':2,
\t\t\t'fid':851982,
\t\t\t'uid':'522717',
\t\t\t'pg':pgs,
\t\t\t'rep':'0',
\t\t\t't':ib07i1,
\t\t\t'k':_gyjju,
\t\t\t'up':1,
\t\t\t'vip':'0',
\t\t\t'webfoldersign':'',
\t\t\t\t\t\t},
\t\t\tdataType : 'json',
\t\t\tsuccess:function(msg){
\t\t\t\t//隐藏
\t\t\t\tdocument.getElementById("load2").style.display="none";
\t\t\t\tif(msg.zt == '1'){
\t\t\t\t\t\t\t\t\t\tvar data = msg.text;
\t\t\t\t\t$.each(data, function(i, n){
\t\t\t\t\t\tsearch_lock = 2;//解除回车锁
\t\t\t\t\t\tvar str;
\t\t\t\t\t\tvar file_ico;
\t\t\t\t\t\tvar alink = '/' + n.id;
\t\t\t\t\t\tvar file_time ='';
\t\t\t\t\t\t\t\t\t\t\t\tif(n.t ==1){ //style 1
\t\t\t\t\t\t\talink = n.id;
\t\t\t\t\t\t\tn.name_all = n.name_all + '<span class="s_ad">推广</span>';
\t\t\t\t\t\t}
\t\t\t\t\t\t\t\t\t\t\t\tfile_ico = '<div class=pc-fileimg><img src=https://assets.woozooo.com/assets/images/filetype/'+ n.icon +'.gif align=absmiddle border=0></div>';
\t\t\t\t\t\tif(n.p_ico ==1){
\t\t\t\t\t\t\tfile_ico = '<div class=pc-fileimg style=background:url(https://image.woozooo.com/image/ico/'+ n.ico +'?x-oss-process=image/auto-orient,1/resize,m_fill,w_100,h_100/format,png);background-size:50%;background-repeat:no-repeat;background-position:50%;></div>';
\t\t\t\t\t\t}
\t\t\t\t\t\tstr ='<div id=ready><div id=name>'+ file_ico +'<div class=pc-filelink><a href=' + alink + ' target=_blank>' + n.name_all + '</a></div></div><div id=size>'+n.size+'</div><div id=time>'+n.time+'</div></div>';
\t\t\t\t\t\t\t\t\t\t\t\tif(n.id != '-1'){
\t\t\t\t\t\t\t$(str).appendTo("#infos");
\t\t\t\t\t\t}
\t\t\t\t\t});
\t\t\t\t\tpgs++;
\t\t\t\t\t//少于50条，隐"more"
\t\t\t\t\tif(data.length<50){
\t\t\t\t\t\tdocument.getElementById("filemore").style.display="none";
\t\t\t\t\t}
\t\t\t\t\t//alert(data.length);

\t\t\t\t}else if(msg.zt == '2'){
\t\t\t\t\t//sms(msg.info);
\t\t\t\t\tdocument.getElementById("filemore").style.display="none";
\t\t\t\t\t\t\t\t\t}else if(msg.zt == '3'){
\t\t\t\t\t\t\t\t\t}else if(msg.zt == '6'){
\t\t\t\t\tdocument.getElementById("filemore").style.display="none";
\t\t\t\t\tsms(msg.info);
\t\t\t\t\t\t\t\t\t}else{
\t\t\t\t\tsms(msg.info);
\t\t\t\t}
\t\t\t},
\t\t\terror:function(){
\t\t\t\t$("#infos").text("获取失败，请重试");
\t\t\t}
\t
\t});`;

  expect(
    parseRequestCtx(block, { identifiersValue: identifiersResult }),
  ).toEqual({
    data: {
      lx: 2,
      fid: 851982,
      uid: "522717",
      pg: 1,
      rep: "0",
      t: "1728800082",
      k: "6e9819b869db8142100827f9f562f7bf",
      up: 1,
      vip: "0",
      webfoldersign: "",
    },
    url: "/filemoreajax.php?file=851982",
  });
});
