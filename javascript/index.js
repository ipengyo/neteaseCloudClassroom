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
			util.addEventListener(loginUserName, "change",function(event){
				util.removeClass(loginUserName, "error");
			});

			util.addEventListener(loginPassword, "change",function(event){
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
		//var hrefItms = ["http://open.163.com/", "http://study.163.com/", "http://www.icourse163.org/"];
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
				util.removeClass(item,"z-show");
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
			var oldIndex = index;
			index = (index+1) % imgAmount;
			setTimeout(function(){
				switchImg(oldIndex, index);
				switchDot();
				play();
			}, autoInterval)
		}

		//util.addEventListener(mSld,"mouseout",play);
		//util.addEventListener(mSld,"mouseover",stop);

		play();

	});
	

})();