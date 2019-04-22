import Vue from 'vue'
import Vuex from 'vuex'
import util from '../common/utils/util.js'
import api from '../common/utils/config.js'
import http from '../common/utils/http.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		used:false,
		auth_token:null,
		lever:null,
		goods_info:null,
		user_id:null,
		release_id:null,
		order_info:null,
		phone:null,
		update:null,
		newsArr:null,
		mine_html:null,
	},
	mutations: {
		login(state,data) {
			state.auth_token = data.access_token;
			state.level = data.level;
			state.user_id = data.id;
			state.phone = data.mobile;
			console.log(data);
			uni.setStorageSync('auth_token',data.access_token);
			uni.setStorageSync('level',data.level);	
			uni.setStorageSync('user_id',data.id);
		},
		usedapp(state){
			state.used = true;
			uni.setStorage({
				key: 'used',
				data: '1',
				success: function () {
					uni.redirectTo({
						url: '/pages/login/login'
					});
				}
			});
		},
		logout(state) {
			console.log('退出登录');
			state.auth_token = "";
			uni.removeStorage({
				key:'auth_token',
				success() {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}
			})
			
		},
		save_goods(state,data){
			if(data){
				state.goods_info = data;
			}
		},
		release_edit(state,data){
			if(data){
				state.release_id = data;
			}
		},
		save_order(state,data){
			if(data){
				state.order_info = data;
				uni.navigateTo({
					url:'/pages/upgrade/paymentMember'
				});
			}
		},
		search_list(state,data){
			let history = [];
			uni.getStorage({
				key: 'history',
				success: function (res) {
					history = res.data;
					console.log(JSON.stringify(history));
					if(history.length>10){
						history.unshift(data);
						history.pop()
					}else{
						history.unshift(data);	
					}
					history = util.uniq(history);
					uni.setStorageSync('history',history);
				},
				fail() {
					history.unshift(data);
					uni.setStorageSync('history',history);
				}
			});	
		},
		del_search_list(state,data){
			if(data){
				uni.removeStorage({
					key: 'history',
					success: function (res) {
						console.log('del_history');
					}
				});
			}
		},
		save_version(state,data){
			if(data){
				state.update = data;
			}
		},
		news_list(state,data){
			if(data){
				console.log('store');
				console.log(data);
				state.newsArr = data;
			}
		},
		set_unread(state,data){
			if(data){
				http(api.main.number,{
					msg_type:0
				},false).then(res=>{
					console.log("获取未读消息")
					console.log(res)
					if(res.count>0){
						uni.showTabBarRedDot({
							index: 4,
						})
					}else{
						uni.hideTabBarRedDot({
							index: 4,
						})
					}
				})
			}
		},
		save_web(state,data){
			if(data){
				// console.log(data);
				plus.storage.setItem('web', JSON.stringify(data));
				uni.navigateTo({
					url: '/pages/goods/webview',
				});
			}
		},
		save_baichuan(state,data){
			if(data){
				console.log(data);
				// plus.storage.setItem('baichuan', JSON.stringify(data));
				uni.navigateTo({
					url: '/pages/goods/webview',
				});
			}
		},
		mine_html(state,data){
			if(data&&data!=""){
				state.mine_html=data;
				uni.navigateTo({
					url: '/pages/mine/questionContent?html=true',
				})
			}
		}
	},
	actions: {
	}
})

export default store
