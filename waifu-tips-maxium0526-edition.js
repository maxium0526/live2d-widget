/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function loadWidget(waifuPath, apiPath, config) {
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	// $("body").append(`<div id="waifu">
	// 		<div id="waifu-tips"></div>
	// 		<canvas id="live2d" width="300" height="300"></canvas>
	// 		<div id="waifu-tool">
	// 			<span class="fa fa-lg fa-comment"></span>
	// 			<span class="fa fa-lg fa-paper-plane"></span>
	// 			<span class="fa fa-lg fa-user-circle"></span>
	// 			<span class="fa fa-lg fa-street-view"></span>
	// 			<span class="fa fa-lg fa-camera-retro"></span>
	// 			<span class="fa fa-lg fa-info-circle"></span>
	// 			<span class="fa fa-lg fa-times"></span>
	// 		</div>
	// 	</div>`);
	$("body").append(`<div id="waifu"></div>`);
	$("#waifu").append(`
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool"></div>`
			);
	if(config && config.tools){

		if(config.tools.useComment && config.tools.useComment == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-comment"></span>`);
		if(config.tools.usePaperPlane && config.tools.usePaperPlane == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-paper-plane"></span>`);
		if(config.tools.useChangeModel && config.tools.useChangeModel == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-user-circle"></span>`);
		if(config.tools.useChangeTexture && config.tools.useChangeTexture == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-street-view"></span>`);
		if(config.tools.useCamera && config.tools.useCamera == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-camera-retro"></span>`);
		if(config.tools.useInfo && config.tools.useInfo == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-info-circle"></span>`);
		if(config.tools.useHide && config.tools.useHide == true) $("#waifu-tool").append(`<span class="fa fa-lg fa-times"></span>`);
	} else {
		$("#waifu-tool").append(`
				<span class="fa fa-lg fa-comment"></span>
				<span class="fa fa-lg fa-paper-plane"></span>
				<span class="fa fa-lg fa-user-circle"></span>
				<span class="fa fa-lg fa-street-view"></span>
				<span class="fa fa-lg fa-camera-retro"></span>
				<span class="fa fa-lg fa-info-circle"></span>
				<span class="fa fa-lg fa-times"></span>`
				);

	}

	$("#waifu").show().animate({ bottom: 0 }, 3000);

	function registerEventListener() {
		$("#waifu-tool .fa-comment").click(showHitokoto);
		$("#waifu-tool .fa-paper-plane").click(() => {
			if (window.Asteroids) {
				if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
				window.ASTEROIDSPLAYERS.push(new Asteroids());
			} else {
				$.ajax({
					url: "https://cdn.jsdelivr.net/gh/GalaxyMimi/CDN/asteroids.js",
					dataType: "script",
					cache: true
				});
			}
		});
		$("#waifu-tool .fa-user-circle").click(loadOtherModel);
		$("#waifu-tool .fa-street-view").click(loadRandModel);
		$("#waifu-tool .fa-camera-retro").click(() => {
			showMessage("照好了嘛，是不是很可愛呢？", 6000, 9);
			Live2D.captureName = "photo.png";
			Live2D.captureFrame = true;
		});
		$("#waifu-tool .fa-info-circle").click(() => {
			open("https://github.com/stevenjoezhang/live2d-widget");
		});
		$("#waifu-tool .fa-times").click(() => {
			localStorage.setItem("waifu-display", new Date().getTime());
			showMessage("願你有一天能與重要的人重逢。", 2000, 11);
			$("#waifu").animate({ bottom: -500 }, 3000, () => {
				$("#waifu").hide();
				$("#waifu-toggle").show().animate({ "margin-left": -50 }, 1000);
			});
		});
		var re = /x/;
		console.log(re);
		re.toString = () => {
			showMessage("哈哈，你打開了控制台，是想要看看我的小秘密嗎？", 6000, 9);
			return "";
		};
		$(document).on("copy", () => {
			showMessage("你都複製了些甚麼呀，轉載要記得加上出處哦！", 6000, 9);
		});
		$(document).on("visibilitychange", () => {
			if (!document.hidden) showMessage("哇，你終於回來了～", 6000, 9);
		});
	}
	registerEventListener();

	function welcomeMessage() {
		var SiteIndexUrl = location.port ? `${location.protocol}//${location.hostname}:${location.port}/` : `${location.protocol}//${location.hostname}/`, text; //自动获取主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now > 5 && now <= 7) text = "早安！一日之計在於晨，美好的一天就要開始了。";
			else if (now > 7 && now <= 11) text = "早安！工作順利嘛，不要久坐，多起來走動哦！";
			else if (now > 11 && now <= 14) text = "中午了，工作了一個上午，現在是午餐時間！";
			else if (now > 14 && now <= 17) text = "午後很容易犯困呢，今天的運動目標完成了嗎？";
			else if (now > 17 && now <= 19) text = "傍晚了！窗外夕陽的景色很美麗呢，最美不過夕陽紅～";
			else if (now > 19 && now <= 21) text = "晚上好，今天過得怎麼樣？";
			else if (now > 21 && now <= 23) text = ["已經這麼晚了呀，早點休息吧，晚安～", "深夜時要愛護眼睛呀！"];
			else text = "你是夜貓子呀？這麼晚還不睡覺，明天起的來嘛？";
		} else if (document.referrer !== "") {
			var referrer = document.createElement("a");
			referrer.href = document.referrer;
			var domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = `歡迎閱讀<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else if (domain == "baidu") text = `Hello！來自 百度 的朋友<br>你是搜尋 <span style="color:#0099cc;">${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我嗎？`;
			else if (domain == "so") text = `Hello！來自 360 的朋友<br>你是搜尋 <span style="color:#0099cc;">${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我嗎？`;
			else if (domain == "google") text = `Hello！来自 Google搜尋 的朋友<br>歡迎閱讀<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
			else text = `Hello！來自 <span style="color:#0099cc;">${referrer.hostname}</span> 的朋友`;
		} else {
			text = `歡迎閱讀<span style="color:#0099cc;">『${document.title.split(" - ")[0]}』</span>`;
		}
		showMessage(text, 7000, 8);
	}
	welcomeMessage();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
		hitokotoTimer = null,
		messageTimer = null,
		messageArray = ["好久不見，日子過得好快呢……", "大壞蛋！你都多久沒碰人家了呀，嚶嚶嚶～", "Hi～快来逗我玩吧！", "拿小拳拳錘你胸口！"];
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("記得把小家加入Adblock白名單哦！");
	$(document).mousemove(() => {
		userAction = true;
	}).keydown(() => {
		userAction = true;
	});
	setInterval(() => {
		if (!userAction) {
			if (!hitokotoTimer) hitokotoTimer = setInterval(showHitokoto, 25000);
		} else {
			userAction = false;
			clearInterval(hitokotoTimer);
			hitokotoTimer = null;
		}
	}, 1000);

	function showHitokoto() {
		//增加 hitokoto.cn 的 API
		if (Math.random() < 0.6 && messageArray.length > 0) showMessage(messageArray[Math.floor(Math.random() * messageArray.length)], 6000, 9);
		else $.getJSON("https://v1.hitokoto.cn", function(result) {
				var text = `這句一言來自 <span style="color:#0099cc;">『${result.from}』</span>，是 <span style="color:#0099cc;">${result.creator}</span> 在 hitokoto.cn 投稿的。`;
			showMessage(result.hitokoto, 6000, 9);
			setTimeout(() => {
				showMessage(text, 4000, 9);
			}, 6000);
		});
	}

	function showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}

	function initModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId == null) {
			//首次访问加载 指定模型 的 指定材质
			var modelId = 1, //模型 ID, 1 is Pio
				modelTexturesId = 81; //材质 ID
		}
		loadModel(modelId, modelTexturesId);
		$.getJSON(waifuPath, function(result) {
			$.each(result.mouseover, function(index, tips) {
				$(document).on("mouseover", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.click, function(index, tips) {
				$(document).on("click", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.seasons, function(index, tips) {
				var now = new Date(),
					after = tips.date.split("-")[0],
					before = tips.date.split("-")[1] || after;
				if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{year}", now.getFullYear());
					//showMessage(text, 7000, true);
					messageArray.push(text);
				}
			});
		});
	}
	initModel();

	function loadModel(modelId, modelTexturesId) {
		localStorage.setItem("modelId", modelId);
		if (modelTexturesId === undefined) modelTexturesId = 0;
		localStorage.setItem("modelTexturesId", modelTexturesId);

		//temporary code, use for loading localstorage
		if(config.loadPioFromLocal != undefined && config.loadPioFromLocal == true){
			loadlive2d("live2d", waifuPath.split('/').slice(0, -1).join('/') + '/' + "model/Pio/index.json", console.log('Loaded Pio from local storage successfully.'));
			return;
		}

		loadlive2d("live2d", `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`));
	}

	function loadRandModel() {
		var modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
			//可选 "rand"(随机), "switch"(顺序)
		$.ajax({
			cache: false,
			url: `${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`,
			dataType: "json",
			success: function(result) {
				if (result.textures["id"] == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) showMessage("我還沒有其他衣服呢！", 4000, 10);
				else showMessage("我的新衣服好看嘛？", 4000, 10);
				loadModel(modelId, result.textures["id"]);
				console.log(result)
			}
		});
	}

	function loadOtherModel() {
		var modelId = localStorage.getItem("modelId");
		$.ajax({
			cache: false,
			url: `${apiPath}/switch/?id=${modelId}`,
			dataType: "json",
			success: function(result) {
				loadModel(result.model["id"]);
				showMessage(result.model["message"], 4000, 10);
			}
		});
	}
}

function initWidget(waifuPath = "/waifu-tips.json", apiPath = "", config = {}) {
	if (screen.width <= 768) return;
	$("body").append(`<div id="waifu-toggle" style="margin-left: -100px;">
			<span>看板娘</span>
		</div>`);
	$("#waifu-toggle").hover(() => {
		$("#waifu-toggle").animate({ "margin-left": -30 }, 500);
	}, () => {
		$("#waifu-toggle").animate({ "margin-left": -50 }, 500);
	}).click(() => {
		$("#waifu-toggle").animate({ "margin-left": -100 }, 1000, () => {
			$("#waifu-toggle").hide();
		});
		if ($("#waifu-toggle").attr("first-time")) {
			loadWidget(waifuPath, apiPath);
			$("#waifu-toggle").attr("first-time", false);
		} else {
			localStorage.removeItem("waifu-display");
			$("#waifu").show().animate({ bottom: 0 }, 3000);
		}
	});
	if (localStorage.getItem("waifu-display") && new Date().getTime() - localStorage.getItem("waifu-display") <= 86400000) {
		$("#waifu-toggle").attr("first-time", true).css({ "margin-left": -50 });
	} else {
		loadWidget(waifuPath, apiPath, config);
	}
}
