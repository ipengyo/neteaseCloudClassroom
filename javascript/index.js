(function(){
	//1.检测顶部通知条,实现点击X后关闭
	util.ready(function(){
		var cookiesObj = util.getCookies();
		var tipsElement = document.getElementById("tips");
		if(cookiesObj && cookiesObj.isTop){
			util.addClass(tipsElement, "f-dn");
		}else{
			var closeElement = document.getElementById("closeTips");
			util.addEventListener(closeElement, "click", function(event){
				util.preventDefault(event);
				var now = new Date();
				now.setFullYear(now.getFullYear()+1);
				util.setCookie({
					name: "isTop",
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
			attentionEl.removeClass("z-show");
			attentionEl.addClass("z-hide");
		}else{
			var guanzhudncEl = document.getElementById("guanzhudnc");
			var loginModal = document.getElementById("loginModal");
			var closeLoginModal = document.getElementById("closeLoginModal");
			util.addEventListener(guanzhudncEl, "click", function(event){
				util.preventDefault(event);
				loginModal.removeClass("f-hn");
			});
			util.addEventListener(guanzhudncEl, "click", function(event){
				loginModal.addClass("f-hn");
			});
		}
	});

})();