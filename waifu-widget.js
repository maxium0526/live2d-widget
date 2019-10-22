class WaifuWidget{
	constructor(config){
		this.config = config;

		this.file = {};
		this.file.path = document.currentScript.src.split('/').slice(0, -1).join('/') + '/';
		this.file.Live2D = this.file.path + 'live2d.min.js';
		this.file.CSSFile = this.file.path + 'waifu.css';
		this.file.eventMessagesJSON = this.file.path + 'waifu-tips.json';

		this.model = {};
		this.model.loadFrom = 'local';
		this.model.local = {};
		this.model.local.modelName = 'Pio';
		// this.model.local.modelTextureName = '';
		this.model.api = {};
		this.model.api.apiPath = 'https://live2d.fghrsh.net/api';
		this.model.api.modelId = '1';
		this.model.api.modelTextureId = '1';

		this.tools = {};
		this.tools.useComments = true;
		this.tools.usePaperPlane = true;
		this.tools.useChangeModel = true;
		this.tools.useChangeTexture = true;
		this.tools.useCamera = true;
		this.tools.useInfo = true;
		this.tools.useHide = true;

		this.idle = {};
		this.idle.messages = ["好久不見，日子過得好快呢……", "大壞蛋！你都多久沒碰人家了呀，嚶嚶嚶～", "Hi～快来逗我玩吧！", "拿小拳拳錘你胸口！"];

		this.timer = {};
		this.messageTimer = null;

		if(config != undefined){
			if(config.file != undefined){
				let file = config.file;
				if(file.path != undefined) this.file.path = file.path;
				if(file.Live2D != undefined) this.file.Live2D = file.Live2D;
				if(file.CSSFile != undefined) this.file.CSSFile = file.CSSFile;
				if(file.eventMessagesJSON != undefined) this.file.eventMessagesJSON = file.eventMessagesJSON;
			}

			if(config.model != undefined){
				let model = config.model;
				if(model.loadFrom != undefined) this.model.loadFrom = model.loadFrom;

				if(model.local != undefined){
					let local = model.local;
					if(local.modelName != undefined) this.model.local.modelName = local.modelName;
					// if(local.modelTextureName != undefined) this.model.local.modelTextureName = local.modelTextureName;
				}

				if(model.api != undefined){
					let api = model.api;
					if(api.apiPath != undefined) this.model.api.apiPath = api.apiPath;
					if(api.modelId != undefined) this.model.api.modelId = api.modelId;
					if(api.modelTextureId != undefined) this.model.api.modelTextureId = api.modelTextureId;
				}
			}

			if(config.tools != undefined){
				let tools = config.tools;
				if(tools.useComments != undefined) this.tools.useComments = tools.useComments;
				if(tools.usePaperPlane != undefined) this.tools.usePaperPlane = tools.usePaperPlane;
				if(tools.useChangeModel != undefined) this.tools.useChangeModel = tools.useChangeModel;
				if(tools.usePaperPlane != undefined) this.tools.usePaperPlane = tools.usePaperPlane;
				if(tools.useCamera != undefined) this.tools.useCamera = tools.useCamera;
				if(tools.useInfo != undefined) this.tools.useInfo = tools.useInfo;
				if(tools.useHide != undefined) this.tools.useHide = tools.useHide;
			}
		}

		//load before doing window on load
		this.loadLive2DFile();
		this.loadCSSFile();

		let _this = this;
		$(window).on('load', function(){
			_this.init();
		})
	}

	init(){		
		this.appendElements();
		this.loadModel();
		this.setEventListener();
	}

	loadLive2DFile(){
		loadScriptSync(this.file.Live2D);
	}

	loadCSSFile(){
		$("<link>").attr({ href: this.file.CSSFile, rel: "stylesheet" }).appendTo("head");
	}

	appendElements(){
		$("body").append(`<div id="waifu"></div>`);

		$("#waifu").append(`
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="300" height="300"></canvas>
			<div id="waifu-tool"></div>`
		);

		let waifuToolDiv = $("#waifu-tool");
		if(this.tools.useComments) waifuToolDiv.append(`<span class="fa fa-lg fa-comment"></span>`);
		if(this.tools.usePaperPlane) waifuToolDiv.append(`<span class="fa fa-lg fa-paper-plane"></span>`);
		if(this.tools.useChangeModel) waifuToolDiv.append(`<span class="fa fa-lg fa-user-circle"></span>`);
		if(this.tools.useChangeTexture) waifuToolDiv.append(`<span class="fa fa-lg fa-street-view"></span>`);
		if(this.tools.useCamera) waifuToolDiv.append(`<span class="fa fa-lg fa-camera-retro"></span>`);
		if(this.tools.useInfo) waifuToolDiv.append(`<span class="fa fa-lg fa-info-circle"></span>`);
		if(this.tools.useHide) waifuToolDiv.append(`<span class="fa fa-lg fa-times"></span>`);

		$("#waifu").show().animate({ bottom: 0 }, 3000);
	}

	loadModel(){
		if(this.model.loadFrom == 'local'){
			loadlive2d('live2d', this.file.path + 'model/' + this.model.local.modelName + '/index.json', console.log('Live2D model ' + this.model.local.modelName + ' is loaded from local successfully.'));
		} else if(this.model.loadFrom == 'api'){
			if(this.model.api.apiPath != ''){
				loadlive2d('live2d', `${this.model.api.apiPath}/get/?id=${this.model.api.modelId}-${this.model.api.modelTextureId}`, console.log('Live2D model is loaded from API successfully.'));
			} else {
				console.log('Please specify the api path.')
			}
		} else {
			console.log('Please specify where is the model loaded from.')
		}
	}

	loadRandomModel(){
		if(this.model.loadFrom == 'api'){
			let _this = this;
			$.ajax({
				cache: false,
				url: `${_this.model.api.apiPath}/switch/?id=${_this.model.api.modelId}`,
				dataType: "json",
				success: function(result) {
					_this.model.api.modelId = result.model["id"];
					_this.loadModel();
					_this.showMessage(result.model["message"], 4000, 10);
				}
			});
		} else {
			console.log('loadRandomModel() only works if the model is loaded from api.')
		}
	}

	loadRandomModelTexture(){
		if(this.model.loadFrom == 'api'){
			let _this = this;
			$.ajax({
				cache: false,
				url: `${_this.model.api.apiPath}/rand_textures/?id=${_this.model.api.modelId}-${_this.model.api.modelTextureId}`,
				dataType: "json",
				success: function(result) {
					if (result.textures["id"] == 1 && (modelTexturesId == 1 || modelTexturesId == 0)) _this.showMessage("我還沒有其他衣服呢！", 4000, 10);
					else _this.showMessage("我的新衣服好看嘛？", 4000, 10);
					_this.model.api.modelTextureId = result.textures["id"];
					_this.loadModel();
				}
			});
		} else {
			console.log('loadRandomModelTexture() only works if the model is loaded from api.')
		}
		
	}

	showMessage(text, timeout, priority) {
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (this.messageTimer) {
				clearTimeout(this.messageTimer);
				this.messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			this.messageTimer = setTimeout(() => {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}

	setEventListener(){
		let _this = this;
		$.getJSON(this.file.eventMessagesJSON, function(result) {
			$.each(result.mouseover, function(index, tips) {
				$(document).on("mouseover", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					_this.showMessage(text, 4000, 8);
				});
			});
			$.each(result.click, function(index, tips) {
				$(document).on("click", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					_this.showMessage(text, 4000, 8);
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
					_this.idle.messages.push(text);
				}
			});
		});
	}
}

function loadScriptSync(src){
  let script = document.createElement('script');
  script.src = src;
  script.type = "text/javascript";
  script.async = false;
  document.getElementsByTagName('head')[0].appendChild(script);
}