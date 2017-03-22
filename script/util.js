/* 在controller的参数里配置的ajax请求 */
function DATA(url,params,callback){
	if(arguments[0] instanceof jQuery){
		return arguments[0].get(0).DATA;
	}
	if(arguments[0] instanceof HTMLElement){
		return arguments[0].DATA;
	}
	if(this.constructor==arguments.callee){
		for(var v in arguments){
			var arg=arguments[v];
			if(typeof arg=="string"){
				this.url=arg;
			}else if(typeof arg=="object"){
				this.params=arg;
			}else if(typeof arg=="function"){
				this.callback=arg;
			}
		}
	}else{
		return new arguments.callee(url,params,callback);
	}
}

/* 在DATA的参数项params里配置的动态参数（即GO方法里添加的参数的属性名prop）defult为动态参数中没有该属性时使用的缺省值 */
function PARAM(prop,defult){
	if(this.constructor==arguments.callee){
		this.prop=prop;
		this.defult=defult;
	}else{
		return new arguments.callee(prop,defult);
	}
}

/* 添加Cookie */
function addCookie(name, value, options) {
	if (arguments.length > 1 && name != null) {
		if (options == null) {
			options = {};
		}
		if (value == null) {
			options.expires = -1;
		}
		if (typeof options.expires == "number") {
			var time = options.expires;
			var expires = options.expires = new Date();
			expires.setTime(expires.getTime() + time * 1000);
		}
		if (options.path == null) {
			options.path = "/";
		}
		if (options.domain == null) {
			options.domain = "";
		}
		document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires != null ? "; expires=" + options.expires.toUTCString() : "") + (options.path != "" ? "; path=" + options.path : "") + (options.domain != "" ? "; domain=" + options.domain : "") + (options.secure != null ? "; secure" : "");
	}
}
/* 获取Cookie */
function getCookie(name) {
	if (name != null) {
		var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
		return value ? decodeURIComponent(value[1]) : null;
	}
}
/* 移除Cookie */
function removeCookie(name, options) {
	addCookie(name, null, options);
}

/*** 基础方法 end ***/

jQuery.fn.extend({
	/* 绑定一次 */
	once : function(evnt,fun){
		var el=this;
		if(!el.data("_event_"+evnt) || (fun && el.data("_event_"+evnt).toString()!=fun.toString())){
			el.data("_event_"+evnt,fun).bind(evnt,fun);
		}
		return el;
	},
	
	/* 检查DOM中是否有href或src等于该url的标签 */
	checkLinkHas : function(url,attr){
		var has=false;
		this.each(function(){
			if(attr ? $(this).attr(attr)==url : ($(this).attr("href")==url || $(this).attr("src")==url)){
				return has=true;
			}
		});
		return has;
	},

	newTree:function(){
		var types={
			"default" : {
                "icon" : "fa fa-file-o"
            },
            "file-x" : {
            	"icon" : "fa fa-file"
            }
		},
			faIcons="folder,folder-o,folder-open,folder-open-o".split(",");
			faFileIcons="code-o,image-o,text-o,pdf-o,word-o,excel-o,powerpoint-o,zip-o,audio-o,movie-o".split(",");
		for(var i=0;i<faIcons.length;i++){
			types[faIcons[i]]={
				"icon" : "fa fa-"+faIcons[i]
			};
		}
		for(var i=0;i<faFileIcons.length;i++){
			types[faFileIcons[i].split("-o")[0]]={
				"icon" : "fa fa-file-"+faFileIcons[i]
			};
		}
		this.jstree({
            "core" : {
                "check_callback" : true
            },
            "plugins" : [ "types", "dnd" ],
            "types" : types
        });
	}
	
});


/**
 * function trim()
 * @method 截取字符串的首尾空格
 * @param null
 * @return String
 */
String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,'');};
/**
 * function setLength()
 * @method 按实际长度截取字符串(中文为英文两倍)
 * @param Number 最大长度
 * @return Number 截取后的字符串
 */
String.prototype.setLength=function(max){
	var n=0,s="";
	for(var i=0;i<this.length;i++){
		if(this.charCodeAt(i)>128){n+=2;}else{n++;}
		s+=this.charAt(i);
		if(n>=max){return s;}
	}
	return s;
};
/**
 * function getLength()
 * @method 返回实际长度(中文为英文两倍)
 * @param null
 * @return Number 长度
 */
String.prototype.getLength=function(){
	var n=0;
	for(var i=0;i<this.length;i++){
		if(this.charCodeAt(i)>128){n+=2;}else{n++;}
	}
	return n;
};
/* 将字符进行HTLM逃逸 */
String.prototype.escapeHTML = function () {
	return this.replace(/&/gm,'&amp;').replace(/>/gm,'&gt;').replace(/</gm,'&lt;').replace(/"/gm,'&quot;');
};
/* 将逃逸的HTML字符转回为HTML */
String.prototype.returnHTML = function () {
	return this.replace(/&amp;/gm,'&').replace(/&gt;/gm,'>').replace(/&lt;/gm,'<').replace(/&quot;/gm,'"');
};

/* 数组与单个都处理 */
Function.prototype.allHandle=function(o){
	if(!o instanceof Array && !(jQuery&&o instanceof jQuery)){
		o=[o];
	}
	if(o && o.length){
		for(var i=0;i<o.length;i++){
			this(o[i]);
		}
	}
};

/* 时间格式化 */
Date.prototype.format = function(format){
	var o = {
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"D+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"H+" : this.getHours(), //hour
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	};

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) {
		if(new RegExp("("+ k +")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
};

var UTIL={
	isPC : function(){
		var PL=["Win","Mac","X11","Linux"];
		for(var i=0;i<PL.length;i++){
			if(navigator.platform.indexOf(PL[i])==0 && navigator.platform.indexOf("arm")<0){
				return true;
			}
		}
		return false;
	},
	isMobile : function(){
		var PL=["Win","Mac","X11","Linux"];
		for(var i=0;i<PL.length;i++){
			if(navigator.platform.indexOf(PL[i])==0 && navigator.platform.indexOf("arm")<0){
				return false;
			}
		}
		return true;
	},
	isIOS :function(){
		var PL=["iPhone","iPad","iPod"];
		for(var i=0;i<PL.length;i++){
			if(navigator.platform.indexOf(PL[i])==0){
				return true;
			}
		}
		return false;
	},
	isAndroid : function(){
		if(navigator.platform.indexOf("Linux")==0 && navigator.platform.indexOf("arm")>5){
			return true;
		}
		return false;
	},

/* 判断对象 排除DOM和array */
	isObject : function(o){
		return Object.prototype.toString.call(o)==="[object Object]";
	},
	
/* 判断DOM */
	isDOM : function(o){
		return o instanceof HTMLElement;
	},
	
/* 判断数组 */
	isArray : function (o){
	    return Object.prototype.toString.call(o)==="[object Array]";
	},

/* 判断数组是否包含某些元素中的任意一个 */
	anyHas : function(o,a){
		for(var n=0;n<a.length;n++){
			for(var i=0;i<o.length&&o[i]!=a[n];i++);
			return !(i==o.length);
		}
	},

/* 判断数组是否包含这些全部元素 */
	allHas : function(o,a){
		for(var n=0;n<a.length;n++){
			for(var i=0;i<o.length&&o[i]!=a[n];i++);
			if(i==o.length)return false;
		}return true;
	},

/* 阻止默认事件 */
	preventDefault : function (e){
		if(document.all)window.event.returnValue=false;
		e.preventDefault();
		return false;
	},

/* 阻止冒泡 */
	stopPropagation : function (e,o){
		e=e||window.event;
		e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		if(o)$(o).parents().each(function(){var p=this;if(p.href)p.onclick=UTIL.preventDefault;});
	},

/* 浮动高度居中 */	
	fixCenter:function(dom){
		if(UTIL.isDOM(dom)){
			$(dom).css({
				"top":($(window).height()-$(dom).outerHeight(true))/2,
				"left":($(window).width()-$(dom).outerWidth(true))/2,
				"position":"fixed",
				"z-index":999
			});
		}
	},
		
	getScrollBottom:function(){
		return $("body").outerHeight(true)-$("body").scrollTop()-$(window).outerHeight(true);
	},
	
/* 快捷上传 */
	simpleUpload:function(option){
		option=UTIL.isObject(option)?option:{};
		$.extend({
			/* 以下为默认值，url是必须传的 */
			accept:"image/*",		/* 上传文件类型 */
			multiple:"true",		/* 多文件上传 */
			url:"",					/* 保存文件信息的请求地址 (必传参数)*/
			fileUrl:"image",		/* 保存文件地址的键名 */
			fileName:"fileName",	/* 保存文件名的键名 */
			data:{},				/* 附加参数 */
			type:"post",			/* 请求方式 */
			callback:function(res){	/* 回调 */
			},
			log:false				/* 打印日志 */
		},option);
		var input=document.createElement("INPUT");
		input.type="file";
		input.accept=option.accept;
		if(option.multiple!=false)input.multiple="true";
		var log=option.log?function(o){console.log(o);}:function(){};
		$(input).change( function(e) {
			function saveImg(data){
				if(option.url){
					$.ajax({
						url:option.url,
						data:$.extend(option.data,data),
						async:false,
						type:"post",
						success:function(res){
							log(res);
							uploadFilesCount--;
							if(uploadFilesCount<1){
								log("SimpleUpload over.");
								option.callback(res);
							}
						},
						error:function(res){
							alert(res);
							uploadFilesCount--;
							if(uploadFilesCount<1){
								log("SimpleUpload over.");
								option.callback(res);
							}
						}
					});
				}
			}
			var files = window.uploadFiles = e.target.files || e.dataTransfer.files;
			window.uploadFilesCount = files.length;
			for(var i=0;i<files.length;i++){
				var xhr = new XMLHttpRequest();
				var file=xhr.file=files[i];
				var data = new FormData();
				data.append("file", file);
				xhr.upload.addEventListener("progress",	 function(e){
					log(e.loaded/e.total*100+"%");
				}, false);
				xhr.addEventListener("load", function(e){
					var res=JSON.parse(this.responseText);
					var filename=this.file.name;
					log("SimpleUpload load:");
					log(res);
					log(filename);
					saveImg(eval("({"+option.fileUrl+":res.url,"+option.fileName+":filename})"));
				}, false);
				xhr.addEventListener("error", function(e){
					log("SimpleUpload error:");
					log(this.responseText);
					uploadFilesCount--;
				}, false);
				xhr.open("POST",basePath+"/file/upload.jhtml", true);
				xhr.setRequestHeader("token", getCookie("token"));
				xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				xhr.setRequestHeader("X_FILENAME", encodeURIComponent(file.name));
				xhr.send(data);
			}
		});
		input.click();
		return input;
	},

/* 图片加载回调 */
	imgLoadCall:function(el,fn){
		var imgs=[];
		$(el).each(function(){
			var dfd=$.Deferred();  
			$(this).bind('load',function(){
				dfd.resolve();  
			}).bind('error',function(){
				dfd.resolve();
			});
			if(this.complete)setTimeout(function(){  
				dfd.resolve();
			},100);  
			imgs.push(dfd);  
		}); 
		$.when.apply(null,imgs).done(function(){
			/* all loaded callback */
			(fn)();
		});
	},

/* shopxx AJAX全局设置 令牌 */
	setAjaxToken:function(){
		/* shopxx AJAX全局设置 */
		$.ajaxSetup({
			traditional: true
		});
		/* shopxx 令牌 */
		$(document).ajaxSend(function(event, request, settings) {
			if (!settings.crossDomain && settings.type != null && settings.type.toLowerCase() == "post") {
				var token = getCookie("token");
				if (token != null) {
					request.setRequestHeader("token", token);
				}
			}
		});
		/* shopxx 状态 */
		$(document).ajaxComplete(function(event, request, settings) {
			var tokenStatus = request.getResponseHeader("tokenStatus");
			var validateStatus = request.getResponseHeader("validateStatus");
			var loginStatus = request.getResponseHeader("loginStatus");
			if (tokenStatus == "accessDenied") {
				var token = getCookie("token");
				if (token != null) {
					$.extend(settings, {
						global: false,
						headers: {token: token}
					});
					$.ajax(settings);
				}
			} else if (validateStatus == "accessDenied") {
				alert("非法字符");
			} else if (loginStatus == "accessDenied") {
				alert("登录超时，请重新登录");
				setTimeout(function() {
					location.reload(true);
				}, 2000);
			} else if (loginStatus == "unauthorized") {
				alert("对不起，您无此操作权限！");
			}
		});
	},

/* ajax同步请求并返回值 */
	ajaxSync:function(/*url,params,callback*/){
		var url,params,callback;
		var response;
		for(var v in arguments){
			var arg=arguments[v];
			if(typeof arg=="string"){
				url=arg;
			}else if(typeof arg=="object"){
				params=arg;
			}else if(typeof arg=="function"){
				callback=arg;
			}
		}
		$.ajax({
			url:url,
			data:params,
			async:false,
			type:"post",
		}).always(function(r,s,q){
			r=eval("("+r+")");
			response=(s=="success" && callback)?callback(r):r;
		});
		return response;
	},
/* 无值赋值处理 处理 object.object.object... = value 这样的赋值语句 其中遇到undefined自动init 把undefined设为空对象 */
	autoObjSet:function(str,obj){
		var reg=/([A-Za-z_][A-Za-z0-9_]*(\s*\.\s*[A-Za-z_][A-Za-z0-9_]*)*\s*=)/mg,
			lines=str.match(reg);
			str=str.replace(reg,"(obj||window).$1");
		for(var i=0;i<lines.length;i++){
			var line=lines[i].replace("=",""),
				chains=line.split("."),
				chain=obj||window;
			for(var j=0;j<chains.length;j++){
				chain[chains[j]]=chain[chains[j]]||{};
				chain=chain[chains[j]];
			}
		}
		eval("(function(){"+str+"})()");
	},

/* 处理ctrl中的params 将params复制并将其中的DATA转换成相应的值 在回调函数的参数中得到复制并转换后的新params ***{{{精华}}}*** */
	dataHandle:function(params, callback){
		var dfd={},
			str="",
			datas=$.extend(true,{},params);
		function f(data,v){
			dfd[v||0]=$.Deferred();
			str+=",dfd['"+(v||0)+"']";
			var dps=$.extend(true,{},$._(data,v).params);
			for(var i in dps){
				var p=dps[i];
				if(p.constructor==PARAM){
					dps[i]=params[p.prop]||p.defult;
				}
			}
			$.post($._(data,v).url,dps).always(function(r,s,q){
				if(s=="error"){
					var txt=r.responseText.replace(/[\s\S]*<dt>([\s\S]*?)<\/dt>[\s\S]*/gm,"$1") || r.responseText.replace(/<[\s\S]*?>/gm,"");
					/* 服务端未处理错误 */
					DO(500,{info:txt});
				}else{
					try{
						r=(typeof r=="object")?r:eval("("+r+")");
						if(r.status=="error"){
							/* 服务端已处理错误 */
							DO("error",{info:r.content});
						}else{
							(function(dat){
								dat=(s=="success" && dat.callback)?dat.callback(r):r;
								(q.v==null)?
									datas=dat:
									datas[q.v]=dat;
							})($._(data,q.v));
							dfd[q.v||0].resolve();
						}
					}catch(e){
						/* 客户端解析错误 */
						DO("error",{info:e.name+": "+e.message});
						(window._ErrorStack=window._ErrorStack||[]).push(e);
						throw e;
					}
				}
			}).v=v;
		}
		if(params.constructor==DATA){
			f(datas);
		}else{
			for(var v in datas){
				if(datas[v] && datas[v].constructor==DATA){
					f(datas,v);
				}
			}
		}
		eval("$.when("+str.replace(",", "")+")").then(function(){
			callback && callback(datas);
		});
	}

};


$.extend(jQuery,{
	/* 将获取对象的属性，若参数为空或undefined，则返回对象自身 */
	_:function(obj,attr){
		return attr==null?obj:obj[attr];
	},
	/* 对象相减 */
	except : function(obj, exc, equal){
		for(var v in exc){
			if(equal && obj[v]==exc[v]){
				delete obj[v];
			}else{
				delete obj[v];
			}
		}
		return obj;
	}
});

$.extend(jQuery, UTIL);