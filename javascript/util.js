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

	//对String 的原型进行扩展,参考自深入浅出Nodejs @author ipengyo@qq.com
	String.prototype.format = (function(){
		var regCache = [];
		var numberReg = /\#{(\d+)\}/g;
		return function(args) {
			var funArguments = arguments;
		    var result = this;
		    if (arguments.length > 0) {
		        if (arguments.length == 1 && typeof(args) == "object") {
		            for (var key in args) {
		                var reg = regCache[key] || (regCache = new RegExp("(#{" + key + "})", "g"));
		                result = result.replace(reg, args[key]);
		            }
		        } else {
            	    result = result.replace(numberReg,function(m,x){  
            	           return funArguments[x];  
            	     });  
		        }
		        return result;
		    } else {
		        return this;
		    }
		} 
	})(); 

    /**
     * 数组遍历函数
     * @param {Array} array 待遍历的数组
     * @param {Function} fn 回调函数
     * @ignore
     */
    var forEach = util.forEach = function(array, fn) {
        for (var i = 0, len = array.length; i < len; i++) {
            fn(array[i], i);
        }
    }

	/**
	 * 扩展，当一个参数的时候向自己扩展 多个参数的时候，后面的向第一个扩展，并覆盖
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	var extend = util.extend = function(obj){
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

		forEach([].slice.call(arguments,1), function(item){
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
		var listCookie = all.split("; ");
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
	 var cookie = encodeURIComponent(opt.name)+'='+ encodeURIComponent(opt.value);
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
				oldClassName = oldClassName.trim();
			})
			el.className = oldClassName;
		}
	};
	 //第二个参数:是否冒泡,第三个参数:是否可以preventDefault阻止事件
	var createEvent = function(type, isbubbling, ispreventDefault){
		var event = document.createEvent('Events');
         event.initEvent(type, isbubbling || true, ispreventDefault || true);
         return event;
	}
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
	 * 给el触发事件
	 * @param  {[type]} el   [description]
	 * @param  {[type]} type [description]
	 * @return {[type]}      [description]
	 */
	var triggerEventListener = util.triggerEventListener = function(el, type){
		if(el && type){
			if(el.dispatchEvent){
				el.dispatchEvent(createEvent(type));
			//IE
			}else if(el.fireEvent){
				el.fireEvent(createEvent(type));
			}
		}
	}

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
	    	if(arguments.length == 0){
	    		return ;
	    	}
	    	if(arguments.length == 1){
	    		sClass = oEl;
	    		oEl =  d;
	    	}
	    	return oEl.getElementsByClassName(sClass);
	    }
	  }else{
                return function(oEl, sClass) {
                    if (arguments.length == 0) {
                        return ;
                    }

                    if (arguments.length == 1) {
                        sClass = oEl;
                        oEl = d;
                    }

                    var aEle = oEl.getElementsByTagName('*'),
                        arr = [];

                    forEach(aEle, function(item) {
                        classReg(sClass).test(item.className) && arr.push(item);
                    });

                    return arr;
                };

	  } 
	})();
	/**
	 * 给元素设置透明度
	 * @param  {[type]} el    [description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	var setOpacity = util.setOpacity = function(el, value){
		if(ie678){
	      // element.style.filter = "Alpha(opacity=" + value*100 + ")";
	      el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + value*100 + ")";
	    }else{
	      el.style.opacity = value;
	    }
	}
	/**
	 * 获取元素透明度
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	var getOpacity = util.getOpacity = function(el){
	    if(ie678){
	      var filterAttr = el.style.filter;
	      if(filterAttr === ""){
	        return 0;
	      }
	      var opacity = filterAttr.substring(filterAttr.indexOf("=") + 1, filterAttr.lastIndexOf(")"));
	      return parseFloat(opacity) / 100;
	    }else{
	      return el.style.opacity;
	    }
	}
	var datasetReg = /^data-/;
	var getElementDataSet = util.getElementDataSet = function(el){
		if(el.dataset) return el.dataset;
		var oDataset = {};
		forEach(el.attributes, function(item, i){
			var name = el.attributes[i].nodeName;
			if(datasetReg.test(name)){
				oDataset[name.substring(5)] = el.attributes[i].value;
		   }
		})

		return oDataset;
	};

	/**
	 * domReady 实现 参考自  baidu  + 自己理解
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
	/**
	 * ajax操作
	 * @param  {Object} ){		var defaults      [description]
	 * @return {[type]}          [description]
	 */
	var ajax = util.ajax = (function(){
		var defaults = {
                method: 'GET',
                async : true
        };
        var xmlHttpReq ;
        var getXMLHttpReq = function(){
        	var _xmlHttpReq;
        	if(window.XMLHttpRequest){
        		_xmlHttpReq = window.XMLHttpRequest;
        	}else if(window.ActiveXObject){
        		//为了兼容IE7以下 浏览器
        		var versions = [ "MSXML2.XMLHttp.5.0",  "MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp","Microsoft.XMLHttp"]; 
        		forEach(versions, function(item){
        			try{
        				_xmlHttpReq = new window.ActiveXObject(item);
        			}
        			catch(e){
        				console.error("IE下ajax对象创建失败");
        			}
        		});
        	}
        	return _xmlHttpReq;
        }

        return function(opts){
        	opts.method && (opts.method = opts.method.toUpperCase());
        	//浅拷贝
        	opts = extend({}, defaults, opts);
        	xmlHttpReq || (xmlHttpReq = getXMLHttpReq())
        	var xhr = new xmlHttpReq();

     		if(opts.method === "GET" && opts.data != null && opts.data != "undefined"){
		       opts.url = opts.url + "?" + serializeObj_str(opts.data);
		    }

        	//打开链接
        	xhr.open(opts.method, opts.url, opts.async);
        	//设置header
            if (opts.header) {
               for (var p in opts.header) {
              	 xhr.setRequestHeader(p, opts.header[p]);
               }
            }
        	//监控readyState 改变事件
        	xhr.onreadystatechange = function(){
        		if (xhr.readyState==4 ){
        			var _responseText = xhr.responseText;
        			if(xhr.status == 200){
        				var _successFn = opts.success;
        				typeof(_successFn) == 'function' && _successFn(_responseText);
        			}else{
        				var _errorFn = opts.error;
    					typeof(_errorFn) == 'function' && _errorFn(_responseText);
        			}
        		}
        	}

        	//发送数据
        	if(opts.method.toUpperCase() === "GET"){
        	    xhr.send();
        	}else if(opts.method.toUpperCase() === "POST"){
        		xhr.send(serializeObj_str(opts.data));
        	}
        };
	})();

})(this);
