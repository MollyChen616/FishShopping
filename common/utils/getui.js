//个推消息监听

//#ifdef APP-PLUS
//监听点击事件
  plus.push.addEventListener( "click", function( msg ) {
	  let openmsg={type:'',sourceId:'',sourceType:'',title:'',content:''};
    let payload="";
				payload = msg.payload;
				if(typeof(payload)=='string'){
					payload = JSON.parse(payload);
				}
				openmsg.type = payload.type;
				openmsg.sourceId= payload.sourceId ;
				openmsg.title = payload.title;
				openmsg.content = payload.content;
				openmsg.sourceType = payload.sourceType;
				
				console.log(openmsg);
				plus.runtime.setBadgeNumber(0);
				if(openmsg.sourceId>0){
					jump(openmsg.sourceType,openmsg.sourceId);
				}
    }, false );

// 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {
		let openmsg={type:'',sourceId:'',sourceType:'',title:'',content:'',msg:''};
		let payload="";
    payload = msg.payload;
		
		if(typeof(payload)=='string'){
			payload = JSON.parse(payload);
		}
		
		//如果是创建时监听到的本地消息则不处理
		if(payload.msg=='local'){
			return
		}
		
		openmsg.type = payload.type;
		openmsg.sourceId= payload.sourceId ;
		openmsg.title = payload.title;
		openmsg.content = payload.content;
		openmsg.sourceType = payload.sourceType;
		openmsg.msg = payload.msg;
		
		plus.runtime.setBadgeNumber(0);

		if(openmsg.type==1){ //弹框消息
			console.log('弹框消息');
			if(plus.os.name == 'Android'){
				//检查app是前台还收后台
				let appground = uni.getStorageSync('appground');
				if(appground == 'back'){
					//安卓后台时回写消息
					openmsg.msg = 'local';
					plus.push.createMessage( openmsg.content, JSON.stringify(openmsg), {
						cover:false,
						icon:'../../static/logo.png'
					});
				}else{
					uni.showModal({
						title:openmsg.title,
						content:openmsg.content,
						showCancel:false,
						success() {
								jump(openmsg.sourceType,openmsg.sourceId);
						}
					})
				}
			}else{
				uni.showModal({
					title:openmsg.title,
					content:openmsg.content,
					showCancel:false,
					success() {
							jump(openmsg.sourceType,openmsg.sourceId);
					}
				})
			}
		}else if(openmsg.type==2){
			console.log('跳转消息');
			if(plus.os.name == 'iOS'){
				openmsg.msg = 'local';
				plus.push.createMessage( openmsg.content, JSON.stringify(openmsg), {
					cover:false,
					icon:'../../static/logo.png'
				});
			}
		}else if(openmsg.type==3){
			console.log('语音消息');
			openmsg.msg = 'local';
			plus.push.createMessage( openmsg.content, JSON.stringify(openmsg), {
				cover:false,
				icon:'../../static/logo.png'
			});
			setTimeout(function(){
				voice(openmsg.content);
			},3000)
		}
	}, false );
	//#endif
	
	function jump(type,id){
		switch (type){
			case 1:
			uni.navigateTo({
				url: '/pages/mine/msgdetail?id='+id,
			});
				break;
			case 2:
			uni.navigateTo({
				url: '/pages/goods/detail?id='+id,
			})
				break;
			case 3:
			uni.navigateTo({
				url:'/pages/goods/taobaoDetail?id='+id,
			})
				break;
				
			case 4:
			uni.navigateTo({
				url: '/pages/mine/questionContent?id='+id,
				success: res => {},
			});
				break;			
		}  
	}
	
	function voice(msg){
		if(plus.os.name == 'Android') {
			var main = plus.android.runtimeMainActivity();
			var SpeechUtility = plus.android.importClass('com.iflytek.cloud.SpeechUtility');
			SpeechUtility.createUtility(main, "appid=5be53e01");
			var SynthesizerPlayer = plus.android.importClass('com.iflytek.cloud.SpeechSynthesizer');
			var play = SynthesizerPlayer.createSynthesizer(main, null);
			play.startSpeaking(msg, null);
		} else {
			var AVSpeechSynthesizer = plus.ios.importClass("AVSpeechSynthesizer");
			var AVSpeechUtterance = plus.ios.importClass("AVSpeechUtterance");
			var AVSpeechSynthesisVoice = plus.ios.import("AVSpeechSynthesisVoice");
			var sppech = new AVSpeechSynthesizer();
			var voice = AVSpeechSynthesisVoice.voiceWithLanguage("zh-CN");
			var utterance = AVSpeechUtterance.speechUtteranceWithString(msg);
			utterance.setVoice(voice);
			sppech.speakUtterance(utterance);
		}
	}