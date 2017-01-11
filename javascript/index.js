(function(){
	//1.检测顶部通知条,实现点击X后关闭
	util.ready(function(){
		var cookiesObj = util.getCookies();
		var tipsElement = document.getElementById("tips");
		if(cookiesObj && cookiesObj.topclose){
			util.addClass(tipsElement, "f-dn");
		}else{
			var closeTips = document.getElementById("closeTips");
			util.addEventListener(closeTips, "click", function(event){
				util.preventDefault(event);
				var now = new Date();
				now.setFullYear(now.getFullYear()+1);
				util.setCookie({
					name: "topclose",
					value: "1",
					expires: now,
				})
				util.addClass(tipsElement, "f-dn");
			})
		};
	});

	//2.关于网易产品 、 登陆
	util.ready(function(){
		var attentionEl = document.getElementById("attention");
		var cookiesObj = util.getCookies();
		if(cookiesObj && cookiesObj.loginSuc){
			util.removeClass(attentionEl, "z-show");
			util.addClass(attentionEl, "z-hide");
		}else{
			var guanzhudncEl = document.getElementById("guanzhudnc");
			var loginModal = document.getElementById("loginModal");
			var closeLoginModal = document.getElementById("closeLoginModal");
			var loginUserName = document.getElementById("loginUserName");
			var loginPassword = document.getElementById("loginPassword");
			var loginSubmit = document.getElementById("loginSubmit");
			var loginUrl = "http://study.163.com/webDev/login.htm";
			var guanzhuUrl = "http://study.163.com/webDev/attention.htm";
			/**
			 * 检测登陆的表单验证
			 * @return {[type]} [description]
			 */
			var validateLoginForm = function(){
				var _flag = true;
				if(loginUserName.value.length <= 0){
					_flag = false;
					util.addClass(loginUserName, "error");
				}else if (loginPassword.value.length <= 0){
					_flag = false;
					util.addClass(loginPassword, "error");
				}
				return _flag;
			}
			util.addEventListener(loginUserName, "input",function(event){
				util.removeClass(loginUserName, "error");
			});

			util.addEventListener(loginPassword, "input",function(event){
				util.removeClass(loginPassword, "error");
			});

			util.addEventListener(guanzhudncEl, "click", function(event){
				util.preventDefault(event);
				util.removeClass(loginModal,"f-dn");
			});
			util.addEventListener(closeLoginModal, "click", function(event){
				util.addClass(loginModal,"f-dn");
			});
			util.addEventListener(loginSubmit, "click",function(event){
				if(validateLoginForm()){
					util.ajax({
						'url': loginUrl,
						'method': "POST",
						'header': {
							'Content-Type': 'application/x-www-form-urlencoded',
						 },
						'data': {
						 	'userName': util.md5(loginUserName.value),
							'password': util.md5(loginPassword.value),
						 },
						 success: function(data){
						 	if(data == '1'){
						 		//设置Cookie
						 		var now = new Date();
						 		now.setFullYear(now.getFullYear()+1);
						 		util.setCookie({
						 			name: "loginSuc",
						 			value: "1",
						 			expires: now,
						 		});
						 		//调用关注的api
						 		util.ajax({
						 			url: guanzhuUrl,
						 			'header': {
						 				'Content-Type': 'application/x-www-form-urlencoded',
						 			 },
						 			success:function(data){
						 				if(data == '1'){
						 					util.setCookie({
									 			name: "followSuc",
									 			value: "1",
									 			expires: now,
									 		});
									 		//按钮变成已关注
									 		util.removeClass(attentionEl, "z-show");
											util.addClass(attentionEl, "z-hide");
											util.triggerEventListener(closeLoginModal, "click");
						 				}
						 			}
						 		});
						 	}else if(data == '0'){
						 		alert('账号或密码错误!');
						 	}
						 },
					});
				}
			});
		}
	});

	//4.轮播图
	util.ready(function(){
		var mSld = util.getElementsByClassName("m-sld")[0];
		var imglist = mSld.getElementsByTagName("img");
		var dotlist = util.getElementsByClassName(mSld, "dot")[0].children;
		var imgAmount = imglist.length;  //图片数量 
		var index = 0;//当前图片显示的下标
		var autoInterval = 5000;    //自动播放图片的切换时间
		var time = 500;     //渐变总时间
		var interval = 100;  //每次渐变时间 
		var internlOpacity = 1/(time/interval); //每次渐变的透明度 
		var timerId ; //定时器的Id
		var oldIndex ;
		util.forEach(imglist, function(item, i){
			if(i == 0){
				util.addClass(item.parentElement, "top");
				util.setOpacity(item, 1);
			}else{
				util.setOpacity(item, 0);
			}
		})

		//切换下面小圆点
		var switchDot = function(){
			util.forEach(dotlist, function(item){
				if(item.className === "z-show"){
					util.removeClass(item, "z-show");
					return ;
				}	
			});
			util.addClass(dotlist[index], "z-show");
		}
		/**
		 * 切换图片
		 * @param  {[type]} oldIndex [上一张图片的index]
		 * @param  {[type]} tarIndex [下一张图片的index]
		 * @return {[type]}          [description]
		 */
		var switchImg = function(oldIndex,tarIndex){
			if(oldIndex == tarIndex){
				return ;
			}
			//渐变函数
			var gradualChange = function(){
				if (util.getOpacity(imglist[oldIndex]) > 0){
				    if(imglist[tarIndex].style.opacity === ''){
				    	util.setOpacity(imglist[tarIndex], 0);
				    } 
				    util.setOpacity(imglist[oldIndex], util.getOpacity(imglist[oldIndex]) - internlOpacity);
				    util.setOpacity(imglist[tarIndex], parseFloat(util.getOpacity(imglist[tarIndex])) + parseFloat(internlOpacity));
				    setTimeout(gradualChange, interval);
				}else{
				    util.setOpacity(imglist[oldIndex], 0);
				    util.setOpacity(imglist[tarIndex], 1);
				    util.addClass(imglist[tarIndex].parentElement, "top");
				    util.removeClass(imglist[oldIndex].parentElement, "top");
				}
			} 
			gradualChange();	
		}

		var play = function (){
			 oldIndex = index;
			index = (index+1) % imgAmount;
			timerId = setTimeout(function(){
				switchImg(oldIndex, index);
				switchDot();
				play();
			}, autoInterval)
		}

		var stop = function(){
			index = oldIndex;
			clearTimeout(timerId)
		}
		util.addEventListener(mSld,"mouseout",play);
		util.addEventListener(mSld,"mouseover",stop);

		play();

	});
	//5.左侧内容区Tab切换
	util.ready(function(){
		var courseUrl = "http://study.163.com/webDev/couresByCategory.htm";
		var courselist = document.getElementById("courselist");
		var courselistOuter = document.getElementById("courselistOuter");
		var tabs = document.getElementById("coursebdNav").getElementsByTagName("a");


		//创建课程悬浮窗元素
		var createdetailCourseElement = function(dataObj){
			var wrapHtml = ("<div class=\"suspend_course\" id='suspend_course-#{id}'>");
				wrapHtml +=("<div class=\"suspend_course_main f-cb\">");
				wrapHtml +=("<img class=\"logo\" src=\" #{middlephotourl} \" alt=\"\">");
				wrapHtml +=("<div class=\"info\">");
				wrapHtml +=("<h2 class=\"tt\">#{name}</h2>");
				wrapHtml +=("<p class=\"pnum\"> #{learnercount} 人在学</p>");
				wrapHtml +=("<p class=\"autor\">发布者：#{provider}</p>");
				wrapHtml +=("<p class=\"classify\">分类：#{categoryname}</p>");
				wrapHtml +=("</div>");
				wrapHtml +=("</div>");
				wrapHtml +=("<p class=\"suspend_course_introduce\">#{description}</p>");
				wrapHtml +=("</div>");
			var tmpEl = document.createElement('div');
			tmpEl.innerHTML = wrapHtml.format(dataObj);

			return tmpEl.childNodes[0];
		}
		//鼠标移入
		var mouseenterHandler = function(event){
			var divX = 0;
			var divY = 0;
			event = event || window.event;
			var target = event.target || event.srcElement;  
			var courseAreaNode = document.getElementById("courseArea"); 
			divX = this.offsetLeft + this.clientWidth;
			divY = this.offsetTop; 
			var parantWidth=this.offsetParent.clientWidth;

			var dataset = util.getElementDataSet(this);

			var detailNode = createdetailCourseElement(dataset); 
			//左右适应
                var flagProcessingwidth = true;
                if (parentWidth >= 980) {

                    if (dataset.index % 4 == 0) {
                        detailNode.style.left = (parentWidth - this.offsetLeft) + 'px';
                        flagProcessingwidth = false;
                    } else if (dataset.index % 4 == 3) {
                        flagProcessingwidth = false;
                    }
                } else if (parentWidth <= 735) {

                    if (dataset.index % 3 == 0) {
                        flagProcessingwidth = false;
                    }
                }


			if(flagProcessingwidth){
				detailNode.style.left = (divX + 20) + "px";
			}
			detailNode.style.top = divY + "px";
			courselistOuter.appendChild(detailNode);
		}
		//鼠标移出
		var mouseleaveHandler = function(event){
			var dataset = util.getElementDataSet(this);
			var detailNode = document.getElementById("suspend_course-"+dataset.id);
			courselistOuter.removeChild(detailNode);
		}

		//创建课程
		var createCourseElement = function(dataObj,index){
			var courseUl = document.createElement("li");
			var courseA = document.createElement("a");
			courseA.setAttribute("href","http://study.163.com/course/introduction/"+dataObj.id+".htm#/courseDetail")
			courseA.setAttribute("target","view_window")

			courseA.setAttribute("data-id", dataObj.id);
			courseA.setAttribute("data-name", dataObj.name);
			courseA.setAttribute("data-provider", dataObj.provider);
			courseA.setAttribute("data-learnerCount", dataObj.learnerCount);
			courseA.setAttribute("data-categoryName", dataObj.categoryName);
			courseA.setAttribute("data-middlePhotoUrl", dataObj.middlePhotoUrl); 
			courseA.setAttribute("data-description", dataObj.description); 
			courseA.setAttribute("data-index",index+1);
			var wrapHtml =  "<img class='logo' src='#{middlePhotoUrl}' alt='#{name}'>";
				wrapHtml += "<div class='infoarea'>"
				wrapHtml += "<h1 class='tt'>#{name}</h1>"
				wrapHtml += "<h2 class='writer'>#{provider}</h2>"
				wrapHtml += "<p class='pnum'>#{learnerCount}</p>"
				wrapHtml += "<p class='price'>￥#{price}</p>"								
				wrapHtml += "</div>";
			wrapHtml = wrapHtml.format(dataObj);
			courseA.innerHTML = wrapHtml;
			util.addEventListener(courseA,"mouseenter",mouseenterHandler);
			util.addEventListener(courseA,"mouseleave",mouseleaveHandler);
			courseUl.appendChild(courseA);
			return courseUl;
		}
		//执行ajax查询
		var go = function(ctype){
			util.ajax({
				'url': courseUrl,
				'header': {
					'Content-Type': 'application/x-www-form-urlencoded',
				 },
				'data': {
					'pageNo': 1,
					'psize': 20,
					'type': ctype,
				},
				'success' : function(data){
					courselist.innerHTML = '';
					var courseDataObj = JSON.parse(data);
					var courseList = courseDataObj.list;

					util.forEach(courseList, function(item,i){
						courselist.appendChild(createCourseElement(item,i));
					});
				}
			})
		}

		util.forEach(tabs, function(item){
			util.addEventListener(item, "click", function(event){
				util.preventDefault(event);
				var target = event.target || event.srcElement;
				util.forEach(tabs, function(item){
					if(item.className === "z-crl"){
						util.removeClass(item, "z-crl");
						return ;
					}	
				});
				util.addClass(target, "z-crl");
				var dataset = util.getElementDataSet(target);
				var ctype = dataset  && dataset.type;
				go(ctype || 10);//如果获取不到默认为10
			})
		});

		//触发事件
		util.triggerEventListener(tabs[0], "click");
	});
	//7.视频弹框
	util.ready(function(){
		var openVideo =document.getElementById("openVideo");
		var closeVideo = document.getElementById("closeVideo");

		util.addEventListener(openVideo, "click", function(event){
			util.removeClass(videoModal,"f-dn");
		})
		util.addEventListener(closeVideo, "click", function(event){
			util.addClass(videoModal,"f-dn");
		})
	});

	//8.热门推荐
	util.ready(function(){
		var hotIntervalId;
		var hotNode = document.getElementById("rmph");

		//创建课程节点
		var createHotCrs = function(dataObj){
			var wrapHtml = ("<li>");
			wrapHtml += ("<img src=\"#{smallPhotoUrl}\">");
			wrapHtml += ("<h2>#{name}</h2>");
			wrapHtml += ("<span>#{learnerCount}</span>");
			wrapHtml += ("</li>");
			var tmpEl = document.createElement('div');
			tmpEl.innerHTML = wrapHtml.format(dataObj);
			return tmpEl.childNodes[0];
		}
		//请求数据
		util.ajax({
			url: "http://study.163.com/webDev/hotcouresByCategory.htm",
			success: function(data){
				var hotCrsList = JSON.parse(data);
				util.forEach(hotCrsList, function(item){
					hotNode.appendChild(createHotCrs(item));
				});
			}
		});

		//每5秒自动更换热点课程
		var switchHotFn = function(){
			//每次滚动的高度
			var _eachHeight=70; 
			var _top = 0,
				_timer;
			_timer = setInterval(function(){
				_top += 3;
				hotNode.style.marginTop = "-"+_top + 'px';
				if(_top > _eachHeight){
					clearInterval(_timer);

					//上一个结点
					var _onNode = hotNode.children[0]

					//重复滚动
					if(_onNode.nodeType == 1){
						hotNode.removeChild(_onNode);
						hotNode.appendChild(_onNode);
						hotNode.style.marginTop = "0px"; 
					}					
				}
			},30);


		}
		//轮播热点课程
		hotIntervalId = setInterval(switchHotFn, 5000); 

		//绑定mouseover事件
		util.addEventListener(hotNode,"mouseover",function(){
			clearInterval(hotIntervalId);
		});

		//绑定mouseout事件
		util.addEventListener(hotNode,"mouseout",function(){
			hotIntervalId = setInterval(switchHotFn, 5000); 
		});
	});

})();
