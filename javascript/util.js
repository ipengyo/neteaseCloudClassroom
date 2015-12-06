/**
 * 一些常用的方法 
 * @author ipengyo@qq.com 
 * @param  {[type]} global [description]
 * @return {[type]}        [description]
 */
(function(global){
	if(!global.util){
		var util = global.util = {};
	}
	/*ie678判定*/
	var ie678 = util.ie678 = /\w/.test('\u0130');
	var d = document ;


    /**
     * 数组遍历函数
     * @param {Array} array 待遍历的数组
     * @param {Function} fn 回调函数
     * @ignore
     */
    var forEach = util.forEach = function(array, fn) {
        for (var i = 0, len = array.length; i < len; i++) {
            fn(array[i]);
        }
    }

	/**
	 * 扩展，当一个参数的时候向自己扩展 多个参数的时候，后面的向第一个扩展，并覆盖
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	util.extend = function(obj){
		if(obj === void 0){
			return this;
		}
		if(arguments.length == 1){
			for(var p in obj){
				if(obj.hasOwnProperty(p)){
					this[p] = obj[p];
				}
			}
			return this;
		}

		forEach([].spli(arguments,1), function(item){
			for(var p in item){
				if(item.hasOwnProperty(p)){
					obj[p] = item[p];
				}
			}
		});	
		return obj;
	}

	
	/**
	 * 将对象转为参数化的 
	 * @author ipengyo@qq.com
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	var serializeObj_str = util.serializeObj_str = function(obj){
		if (!obj) return "";
		var arr = [];
		for(key in obj){
			if(obj.hasOwnProperty(key) && typeof(obj[key]) != 'function'){
				var name = encodeURIComponent(key);
				var value = encodeURIComponent(obj[key].toString());
				arr[arr.length] = name +"="+ value;
			}
		}
		return arr.join("&");
	};
	/**
	 * 获取当前文档的Cookies,返回Cookie对象
	 * @return {[type]} [description]
	 */
	var getCookies = util.getCookies = function(){
		var cookieObj = {};
		var all = d.cookie;
		if(!all) return cookieObj;
		var listCookie = all.split(";");
		forEach(listCookie, function(item){
	      var p = item.indexOf('=');
	      var name = item.substring(0, p);
	      name = decodeURIComponent(name);
	      var value = item.substring(p + 1);
	      value = decodeURIComponent(value);
	      cookieObj[name] = value;
		});
		return cookieObj;
	}
	/**
	 * 设置cookie {name,value,path,domail,secure}
	 * @param {[type]} opt [description]
	 */
	var setCookie = util.setCookie = function(opt){
	 var cookie = encodeURIComponent(opt.name) + '=' + encodeURIComponent(opt.value);
	  if (opt.expires)
	    cookie += '; expires=' + opt.expires.toGMTString();
	  if (opt.path)
	    cookie += '; path=' + opt.path;
	  if (opt.domain)
	    cookie += '; domain=' + opt.domain;
	  if (opt.secure)
	     cookie += '; secure=' + opt.secure;
	 	 document.cookie = cookie;
	}
	/**
	 * 删除cookie{name path domain}
	 * @param  {[type]} opt [description]
	 * @return {[type]}     [description]
	 */
	var removeCookie = util.removeCookie = function(opt){
		 document.cookie = 'name=' + opt.name + '; path=' + opt.path + '; domain=' + opt.domain + '; max-age=0';
	}


	/**
	 * 生成关于Class的正则
	 * @param  {Object} ) {                   var cache [description]
	 * @return {[type]}   [description]
	 */
    var classReg = (function () {
        var cache = {};
        return function (name) {
            return cache[name] || (cache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
        };
    })();

	/**
	 * 检测某个节点是否拥有该className
	 * @param  {[type]}  el        [description]
	 * @param  {[type]}  className [description]
	 * @return {Boolean}           [description]
	 */
	var hasClass = util.hasClass = function(el , className){
		if(className && el){
			return classReg(className).test(el.className);
		}
	};

	/**
	 * 给某个节点添加class
	 */
	var addClass = util.addClass = function(el , classNames){
		if(classNames && el){
			var oldClassName = el.className;
			var classArr = [];
			forEach(classNames.split("/\s+/"),function(item){
				 !hasClass(el, item) && classArr.push(item);
			})
			classArr.length > 0 && (el.className += (oldClassName ? " " : "") + classArr.join(" "));
		}
	};
	/**
	 * 删除某个节点的className
	 * @param  {[type]} el         [description]
	 * @param  {[type]} classNames [description]
	 * @return {[type]}            [description]
	 */
	var removeClass = util.removeClass = function(el, classNames){
		if(el && classNames){
			var oldClassName = el.className;
			forEach(classNames.split("/\s/"),function(item){
				oldClassName = oldClassName.replace(classReg(item), ' ');
			})
			el.className = oldClassName;
		}
	};
	/**
	 * 给el新增事件
	 * @param {[type]} el      [description]
	 * @param {[type]} type    [description]
	 * @param {[type]} handler [description]
	 */
	var addEventListener = util.addEventListener = function(el, type, handler){
		if(el.addEventListener){
			el.addEventListener(type,handler,false);
		}else if(el.attachEvent){
			el.attachEvent('on'+type,handler);
		}else{
			el['on'+type]=handler;
		}
	};
	/**
	 * 给el删除事件
	 * @param  {[type]} el      [description]
	 * @param  {[type]} type    [description]
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
	 */
	var removeEventListener = util.removeEventListener = function(el, type, handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent('on'+type,handler);
		}else{
			element['on'+type]=null;
		}
	};

	/**
	 * 传入事件对象 组织该事件的默认事件
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	var preventDefault = util.preventDefault = function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	};

	/**
	 * 根据Class获取元素
	 * @param  {[type]} ){	               if(d.getElementsByClassName){	    return function(oEl, sClass, sEle){	    	oEl [description]
	 * @return {[type]}      [description]
	 */
	var getElementsByClassName = util.getElementsByClassName =(function(){
	  if(d.getElementsByClassName){
	    return function(oEl, sClass){
	    	oEl = oEl || d;
	    	return oEle.getElementsByClassName(sClass);
	    }
	  }else{
	  	 return function(oEl, sClass, sEle){
		   	var aEle=oEle.getElementsByTagName(sEle || '*'),
		        arr = [],
		     forEach (aEle, function(){
		     	classReg(sClass).test(sClass) && arr.push(item);
		     });
		    return arr;
		  }
	  } 
	})();

	/**
	 * domReady 实现 参考自  baidu 
	 * @author ipengyo@qq.com
	 */
	var ready = util.ready = (function(){
		var readyList = [];
		var readyBound = false;
		var domReadyFn;
		if(!ie678){
			domReadyFn = function(){
				d.removeEventListener("DOMContentLoaded", domReadyFn , false);
				readyCallBack();
			}
		}else{
			domReadyFn = function(){
				if(d.readyState = 'complete'){
					d.detachEvent("onreadystatechange", domReadyFn);
					readyCallBack();
				}
			}
		}
		//利用页面未加载完成时 调用documentElement.doScroll方法会爆出异常来实现domReady
		var doSrcollCheck = function(){
			try{
				d.documentElement.doScroll("left");
			}catch(e){
				setTimeout(doSrcollCheck, 1);
				return ;
			}
			readyCallBack();
		}

		var bingReady = function(){
			if(readyBound){
				return ;
			}
			readyBound = true;
			if(ie678){
				d.attachEvent("onreadystatechange", domReadyFn);
				try{
					var isTopElement = window.frameElement == null || false ;
					(isTopElement && d.documentElement.doSrcoll) && doSrcollCheck();
				}catch(e){}
			}else{
				d.addEventListener("DOMContentLoaded", domReadyFn , false );
			}
			addEventListener(window, "load" ,domReadyFn);
		}
		var readyCallBack = function(){
			if(!ready.isReady){
				ready.isReady = true;
				//执行队列
				forEach(readyList, function(item){
					item();
				})
			}
		}
		bingReady();
		return function(callback){
			//没有加载完就直接执行，没有加载完就加到队列里面去
			ready.isReady ? callback() : readyList.push(callback);
		}	
	})();

})(this);