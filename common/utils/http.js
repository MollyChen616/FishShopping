import store from '../../store'

function http(url,data,loading=true,hidetoast=false){
	//检查网络链接
	console.log('联网类型');
	uni.getNetworkType({
		success: function (res) {
			console.log('联网类型：'+res.networkType);
			if(res.networkType === 'none'){
				console.log('无网络');
				let pages = getCurrentPages();
				console.log(pages);
				if(pages.length>1){
					let page = pages[pages.length-1]; //当前页面路由
					uni.redirectTo({
						url:'/pages/nonetwork?page='+page.route+'&options='+JSON.stringify(page.options),
					})
				}else if(pages.length>0){
					let page2 = pages[0].route;
					if(page2=='pages/home'||page2=='pages/label'||page2=='pages/release'||page2=='pages/share'||page2=='pages/mine'){ //tabbar页面
						uni.redirectTo({
							url:'/pages/nonetwork?page='+page2+'&options={}',
						})
					}
				}
			}
		}
	});
  return new Promise((resolve,rej) => {
    let auth_token = store.state.auth_token;
    if (auth_token==''||auth_token==undefined) {
      auth_token = uni.getStorageSync('auth_token');
    }
		//#ifdef APP-PLUS
		let app_version = plus.runtime.version;
		if(loading){
			plus.nativeUI.showWaiting('请求中');
		}
		//#endif

	  uni.request({
	  	url:url,
			data:Object.assign(data, {'access_token':auth_token}),
			method:'POST',
			timeout:30000,
			header:{
				'content-type':'application/x-www-form-urlencoded',
				//#ifdef APP-PLUS
				'app_version':app_version,
				//#endif
			},
		success:function(res){
			if(res.data.code===0){
				resolve(res.data.data);
				return;
			}else if(res.data.code===-1){
				//#ifdef APP-PLUS
				plus.nativeUI.toast('请登录');
				setTimeout(function(){
					uni.navigateTo({
						url:'/pages/login/login'
					})
				},1000)
				//#endif
				
				//#ifdef MP-WEIXIN
				uni.showToast({
					title: '请登录',
					icon:'none',
					complete(){
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
				});
				//#endif
				return;
			}else if(res.data.code===2){
				rej(res.data);
				return;
			}else{
				if(!hidetoast){
					//#ifdef APP-PLUS
					plus.nativeUI.toast(res.data.msg);
					//#endif
					
					//#ifdef MP-WEIXIN
					uni.showToast({
						title: res.data.msg,
						duration: 2000,
						icon:'none',
					});
					//#endif
					
				}
				rej(res.data);
				return;
			}
		},
		fail:function(err){
			console.log(err);
			rej(err);
			//#ifdef APP-PLUS
			plus.nativeUI.toast('网络异常');
			//#endif
			
			//#ifdef MP-WEIXIN
			uni.showToast({
				title: '网络异常',
				duration: 2000,
				icon:'none'
			});
			//#endif
		},
		complete:function(){
			//#ifdef APP-PLUS
				plus.nativeUI.closeWaiting();
			//#endif
			}
	  })
  })
}

export default http
