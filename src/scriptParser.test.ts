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

  const inlineDataBlock = `\t\t$.ajax({
\t\t\ttype : 'post',
\t\t\turl : '/ajaxm.php?file=45198696',
\t\t\tdata : { 'action':'downprocess','sign':skdklds,'p':pwd,'kd':kdns },

\t\t\tdataType : 'json',
\t\t\tsuccess:function(msg){
\t\t\t\tvar date = msg;
\t\t\t\tvar dom_down = date.dom;
\t\t\t\tif(date.zt == '1'){
\t\t\t\t\t$("#downajax").html("<a href="+dom_down+"/file/"+ date.url + lanosso +" target=_blank rel=noreferrer>下载</a>");
\t\t\t\t\t$("#passwddiv").hide();
\t\t\t\t\t$("#filenajax").text(date.inf);
\t\t\t\t\tdocument.title = date.inf;
\t\t\t\t\t$(".n_box_des").show();
\t\t\t\t\t$("#file").removeClass("filter");
\t\t\t\t}else{
\t\t\t\t\t$("#info").text(date.inf);
\t\t\t\t};
\t\t\t\t
\t\t\t},
\t\t\terror:function(){
\t\t\t\t$("#info").html("失败，请刷新");
\t\t\t}
\t
\t\t});`;

  expect(
    parseRequestCtx(inlineDataBlock, {
      identifiersValue: {
        skdklds:
          "UjQHOQ4_aAzIDCgs0UGBUaFs1UmJXOQM4AT4DM1E0UWZTdQIhDGwGYwloCm5UOAE4VD4GM1M8VmxVYA_c_c",
        kdns: "1",
      },
      pwd: "114514",
    }),
  ).toEqual({
    data: {
      action: "downprocess",
      sign: "UjQHOQ4_aAzIDCgs0UGBUaFs1UmJXOQM4AT4DM1E0UWZTdQIhDGwGYwloCm5UOAE4VD4GM1M8VmxVYA_c_c",
      p: "114514",
      kd: 1,
    },
    url: "/ajaxm.php?file=45198696",
  });
});
