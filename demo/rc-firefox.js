	var search_lock = 2;//search lock
	var pwd;
	var pgs;
	var ib07i1 = '1728800082';
	var _gyjju = '6e9819b869db8142100827f9f562f7bf';
	pgs =1;
		document.getElementById("load2").style.display="block";
	file();
		document.getElementById('rpt').innerHTML='举报';
function sms(stx){
	document.getElementById("sms").style.display="none";
	$("#smsspan").text(stx);
	document.getElementById("sms").style.display="block";
	setTimeout('document.getElementById("sms").style.display="none";',5000);
}
function file(){
		$.ajax({
			type : 'post',
			url : '/filemoreajax.php?file=851982',
			data : { 
			'lx':2,
			'fid':851982,
			'uid':'522717',
			'pg':pgs,
			'rep':'0',
			't':ib07i1,
			'k':_gyjju,
			'up':1,
			'vip':'0',
			'webfoldersign':'',
						},
			dataType : 'json',
			success:function(msg){
				//隐藏
				document.getElementById("load2").style.display="none";
				if(msg.zt == '1'){
										var data = msg.text;
					$.each(data, function(i, n){
						search_lock = 2;//解除回车锁
						var str;
						var file_ico;
						var alink = '/' + n.id;
						var file_time ='';
												if(n.t ==1){ //style 1
							alink = n.id;
							n.name_all = n.name_all + '<span class="s_ad">推广</span>';
						}
												file_ico = '<div class=pc-fileimg><img src=https://assets.woozooo.com/assets/images/filetype/'+ n.icon +'.gif align=absmiddle border=0></div>';
						if(n.p_ico ==1){
							file_ico = '<div class=pc-fileimg style=background:url(https://image.woozooo.com/image/ico/'+ n.ico +'?x-oss-process=image/auto-orient,1/resize,m_fill,w_100,h_100/format,png);background-size:50%;background-repeat:no-repeat;background-position:50%;></div>';
						}
						str ='<div id=ready><div id=name>'+ file_ico +'<div class=pc-filelink><a href=' + alink + ' target=_blank>' + n.name_all + '</a></div></div><div id=size>'+n.size+'</div><div id=time>'+n.time+'</div></div>';
												if(n.id != '-1'){
							$(str).appendTo("#infos");
						}
					});
					pgs++;
					//少于50条，隐"more"
					if(data.length<50){
						document.getElementById("filemore").style.display="none";
					}
					//alert(data.length);

				}else if(msg.zt == '2'){
					//sms(msg.info);
					document.getElementById("filemore").style.display="none";
									}else if(msg.zt == '3'){
									}else if(msg.zt == '6'){
					document.getElementById("filemore").style.display="none";
					sms(msg.info);
									}else{
					sms(msg.info);
				}
			},
			error:function(){
				$("#infos").text("获取失败，请重试");
			}
	
	});
}
function more(){
				$("#filemore").text("文件获取中...");
		$.ajax({
			type : 'post',
			url : '/filemoreajax.php?file=851982',
			data : { 
			'lx':2,
			'fid':851982,
			'uid':'522717',
			'pg':pgs,
			'rep':'0',
			't':ib07i1,
			'k':_gyjju,
			'up':1,
			'vip':'0',
			'webfoldersign':'',
						},
			dataType : 'json',
			success:function(msg){
				if(msg.zt == '1'){
					var data = msg.text;
					$.each(data, function(i, n){
						var str;
						var file_ico;
						var alink = '/' + n.id;
						var file_time ='';
												if(n.t ==1){ //style 1
							alink = n.id;
							n.name_all = n.name_all + '<span class="s_ad">推广</span>';
						}
												file_ico = '<div class=pc-fileimg><img src=https://assets.woozooo.com/assets/images/filetype/'+ n.icon +'.gif align=absmiddle border=0></div>';
						if(n.p_ico ==1){
							file_ico = '<div class=pc-fileimg style=background:url(https://image.woozooo.com/image/ico/'+ n.ico +'?x-oss-process=image/auto-orient,1/resize,m_fill,w_100,h_100/format,png);background-size:50%;background-repeat:no-repeat;background-position:50%;></div>';
						}
						str ='<div id=ready><div id=name>'+ file_ico +'<div class=pc-filelink><a href=' + alink + ' target=_blank>' + n.name_all + '</a></div></div><div id=size>'+n.size+'</div><div id=time>'+n.time+'</div></div>';
												if(n.id != '-1'){
							$(str).appendTo("#infos");
						}
					});
					if(data.length<50){
						document.getElementById("filemore").style.display="none";
					}else{
						$("#filemore").text("更多");
					}
					pgs++;

				}else{
					sms(msg.info);
					document.getElementById("filemore").style.display="none";
				}
			},
			error:function(){
				$("filemore").text("获取失败，请重试");
			}
	
		});
	}
var urls =window.location.href + '?cp=rk956tc.0.0';
var qrcode = new QRCode('code', {
					text: urls,
					width: 138,
					height: 138,
					colorDark : '#3f3f3f',
					colorLight : '#ffffff',
					correctLevel : QRCode.CorrectLevel.H
				});
function s_cl(){
	$(".search").show();
	$("#s_search").hide();
	$("#fileview").show();
	$("#s_file").html("");
}
//search post ajax
function s_post(){
		var wd = document.getElementById('spcinput').value;
	$("#s_load").show();//load style
			$.ajax({
			type : 'post',
			url : '/search/s.php',
			data : { 
			'wd':wd,
			'sign':'CD1UMQ9gVDcDZAFgUygHPgdoDjpUMgc9AjcGLwBzW2pTfAZgXTcPaQFvAWBXOlNrAG5XalM+BClWYQ==',
			//'pg':pgs,
						},
			dataType : 'json',
			success:function(msg){
				if(msg.zt == '1'){
					$("#s_file").html("");
					$("#s_search").show();
					var data = msg.item;
					$.each(data, function(i, n){
						var str;
						var file_ico;
						var alink = '/' + n.id;
						var downstyle = '<div class=filedown><div class=filedown-1></div><div class=filedown-2></div></div>';
						if(n.t ==1){
							alink = n.id;
							n.name_all = n.name_all + '<span class="s_ad">推广</span>';
							downstyle = '';
						}
						file_ico = '<div class=fileimg><img src=https://assets.woozooo.com/assets/images/type/'+ n.icon +'.gif align=absmiddle border=0></div>';
						if(n.p_ico ==1){
							file_ico = '<div class=fileimg style=background:url(https://image.woozooo.com/image/ico/'+ n.ico +'?x-oss-process=image/auto-orient,1/resize,m_fill,w_100,h_100/format,png);background-size:100%;background-repeat:no-repeat;background-position:50%;></div>';
						}
						str ='<div id=ready><div class=mbx><a href=' + alink + ' target=_blank class="mlink minPx-top">'+ file_ico +'<div class=filename>' + n.name_all + '<div class=filesize>'+ n.size +'</div></div>'+ downstyle +'</a></div></div>';
						$(str).appendTo("#s_file");
					});
										$("#fileview").hide();
									}else{
					sms(msg.msg);
				}
				//load style
								setTimeout('document.getElementById("s_load").style.display="none";',1500);
							},
			error:function(){
				sms("获取失败，请重试");
			}
	
		});
}
//huiche
$(document).keyup(function (e) {
	if (e.keyCode == 13) {
		if(search_lock == 2){
			s_post();
		}
	}
});

<!--save-->
document.getElementById("save").addEventListener("click", function(){
	$.ajax({
			type : 'post',
			url : '/savep.php',
			data : { 'action':'save','uid':'522717','sid':'1' },
			dataType : 'json',
			success:function(msg){
				var date = msg;
				if(date.zt == '1'){
				}else{
				};
			},
			error:function(){
				
			}
	
		});
});