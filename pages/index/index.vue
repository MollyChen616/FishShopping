<template>
	<view class="content">
		<!-- logo+搜索框 -->
		<view class="grace-search">
			<image class="search-image " src="../../static/home_logo.png"></image>
			<view class="grace-search-in">
				<view class="input-wrap">
					<view class="grace-search-icon"></view>
					<input class="grace-input" type="search" placeholder="搜索天猫/淘宝宝贝"></input>
				</view>
			</view>
		</view>

		<!-- 分段切换 -->
		<view>
			<scroll-view class="grace-tab-title grace-center" scroll-x="true" :scroll-left="scrollLeft" id="grace-tab-title">
				<view v-for="(cate, index) in categories" :key="index" :id="cate.id"  :data-cateid="cate.cateid" :data-index="index"
				 :class="[cateCurrentIndex == index ? 'grace-tab-current' : '']" @tap="tabChange($event,index)">{{cate.name}}</view>
			</scroll-view>

		</view>
		<!-- 文章内容区 -->
		<view>
			<!-- 广告图片 -->
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" autoplay="true" interval="true" duration="500">
							<block v-for="(item,index2) in shows.swiper" :key="index2">
								<swiper-item :class="[swiperLoadStatus? '': 'grace-skeleton']">
									<image :src="item.pic" @load="swiperLoading" lazy-load mode="widthFix" @click="url(item.url)">
									</image>
								</swiper-item>
							</block>
						</swiper>
					</view>
				</view>
			</view>

			<!-- 商品列表 -->
			<div v-if="!(jingPingList.length===0)" class="goods-wrap">
				<ul>
					<li v-for="(item,index) in jingPingList" :key="index" @tap="goodsClickHandle(item.id)">
						<img :src="item.cover_pic" alt="dsfsadf">
						<div class="title" >{{item.name}}</div>
						<div class="price">￥{{item.price}} <span v-if="item.original_price">￥{{item.original_price}}</span></div>
						<div class="quan">
							<span class="one">{{item.coupon}}元券</span>
							<span class="two">会员返利约 {{item.commission}} 元</span>
						</div>
					</li>
				</ul>
			</div>
			<div v-if="(jingPingList.length===0)" class="goods-wrap2">
				<ul>
					<!-- <li v-for="(item2,index2) in jingPingList" :key="index2" @tap="goodsClickHandle(item2.id)">
						<img :src="item2.cover_pic"> -->
						<text>111111111</text>
					</li>
				</ul>
			</div>

		</view>
	</view>
	</view>
	</view>

</template>

<script>
	var page = 1,
		cate = 0;
	export default {
		data() {
			return {
				
				page: 1,
				top: 0,
				pageSize: 10,
				categories: [],
				// 当前选择的分类
				cateCurrentIndex: 0,
				scrollLeft: 0,
				isClickChange: false,
				swiperLoadStatus: false,
				// 演示文章数据
				artList: [],
				tab_id: 0,
				goodsList: [],
				jingPingList: [],
				shows: {
					swiper: [{
						pic: '../../static/bannerLoading.png'
					}]
				}

			}
		},
		onLoad: function() {
			let that = this;
			let token = uni.getStorageSync('auth_token');
			if (token){
				let time = setInterval(function() {
					let cid = plus.push.getClientInfo().clientid;
					let os_name = plus.os.name.toLowerCase();
					if (cid) {
						that.http(that.api.base.clientid, {
							clientid: cid,
							device_os_name: os_name,
						}, false).then(res => {
							clearInterval(time);
						})
					}
				}, 3000)
			}

		},
		mounted() {
			let _this = this
			this.http(this.api.base.category, {}, false).then(res => {
				console.log(res)
				_this.categories = res.list;
				this.getJPList(res.list[0].id)
				
				_this.getNewsList(_this.categories[0].id);
			})
		},		
		onReachBottom() {

		},
		//下拉刷新
		onPullDownRefresh: function() {
			if (this.categories.length == 0) {
				this.http(this.api.base.category, {}, false).then(res => {
					this.categories = res.list;
				});
			}
			// 重置分页及数据
			page = 1;
			this.artList = [];
			this.getNewsList(this.tab_id);
		},
		// 加载更多
		onReachBottom: function() {

			this.getNewsList();
		},
		methods: {
			goodsClickHandle(id) {
				uni.navigateTo({
					url: '../goodsInfo/goodsInfo?id=' + id,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			getJPList(id) {
				
				var self = this
				uni.request({
					url: this.api.main.goodslist,
					data: {
						page: this.page,
						page_size: this.pageSize,
						cat_id: id,
						status: 100
					},
					success: (res) => {
						//debugger
						self.jingPingList = res.data.data.list
						console.log(self.jingPingList)
					}
				})
			},
			getGoodsList(id){
				var self = this
				uni.request({
					url: ' this.api.main.goodslist',
					method: 'GET',
					data: {},
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			swiperLoading() {
				this.swiperLoadStatus = true
			},
			// 数据和分页是模拟的实际也是这样写
			getNewsList: function(id) {
				let that = this;
				this.tab_id = id;
				this.shows.swiper = [];
				this.categories.forEach(item => {
					if (item.id == id) {
						that.shows.swiper.push({
							pic: item.advert_pic,
							url: item.advert_url
						});
					}
				})

			},
			getWidth: function(id) { //得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						if (id === 'grace-tab-title') {
							console.log("id=", id, "数据:", data)
						}
						res(data);
					}).exec();
				})
			},
			tabChange: async function(e, i) { //点击grace-tab-title
				console.log('pig', e)
				//todo if index = 0 get goodslist,
				//todo index = * git2
				// 重置分页及数据 
				page = 1;
				// 选中的索引
				var index = e.currentTarget.dataset.index;
				// 具体的分类id
				var cateid = e.currentTarget.id;

				if (this.cateCurrentIndex === index) {
					return false;
				} else {
					let tarBar = await this.getWidth("grace-tab-title"),
						tabBarScrollLeft = tarBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.cateCurrentIndex = index;
				}

				// 读取分类数据
				cate = cateid; //把分类信息发送给api接口即可读取对应分类的数据

				this.artList = [];
				// 加载对应分类数据覆盖上一个分类的展示数据 加载更多是继续使用这个分类
				this.getNewsList(cateid);
				this.jingPingList= []

				if(i===0){
					this.getJPList(cateid)             //首页
				}
				else{
					this.getJPList(cateid) 
					this.getGoodsList(cateid)
				}
			},
			loadMore: function(e) {
				this.getNewsList(e);
			}
		}

	}
</script>

<style lang="scss" scoped>
	.goods-wrap {
		width: 100%;

		ul {
			list-style: none;
			padding: 5px;
			width: 100%;

			li {
				text-align: left;
				display: inline-block;
				width: 50%;

				img {
					width: 360upx;
					height: 360upx;
					background-color: pink;
				}

				.title {
					font-weight: 500;
					font-size: 16px;
				}

				.price {
					color: #F04848;
					font-weight: bold;

					span {
						margin-left: 5upx;
						color: #888;
						text-decoration: line-through;
						font-size: 12px;
					}

					
				}
				
				.quan {
					span{
						display: inline-block;
					}
					.one {
						color: #fff;
						background: #F04848;
				
						padding: 1upx 5upx;
						// margin-right: 10px;
					}
				
					.two {
						color: #fe2842;
						background: #ffe1df;
						padding: 1px 2px;
					}
				}
			}

		}

	}
	.goods-wrap2{
		width: 100%;
		ul{
			list-style: none;
			padding: 5upx;
			width: 100%;
			li{
				text-align: left;
				display: inline-block;
				width: 100%;
				
			}
		}
	}
	.grace-input {
		background: #efefef;

	}

	.input-wrap {
		position: relative;
		height: 100upx;
		line-height: 100upx;
		display: flex;
		align-items: center;
	}

	.grace-search-icon {
		position: absolute;
		top: 50%;
		left: 0upx;
		transform: translateY(-50%);
	}

	.grace-search-in {
		height: 100upx;
		line-height: 100upx;
		/* vertical-align: middle;
		 */
		/* line-height: 50upx; */

	}

	.content {
		text-align: center;
		height: 400upx;
	}

	.search-image {
		height: 100upx;
		width: 320upx;
		vertical-align: middle;
	}

	/* 分段器头部 fixed 定位 */

	.fixedit {
		/* width: 100%; */
		position: fixed;
		z-index: 99;
		left: 0;
		top: 0;
	}
</style>
