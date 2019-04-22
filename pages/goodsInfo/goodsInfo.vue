<template>
	<div class="wrap">
		fdsafdsafdsaf
	</div>
</template>

<script>
	export default{
		data() {
			return {
				id: ''
			}
		},
		onLoad(e) {
			this.id = e.id
			let id = e.id
			debugger

			this.getData(id)
		},
		methods:{
			getData(i) {
				let self = this
				uni.request({
					url: 'http://api.youyuyanxuan.com/index.php?store_id=3&r=api/goods/get-goods',
					method: 'POST',
					data: {
	 						id:"3386",
							access_token: "3GI1ac6hmW8sHYqYJfYQv_zzL3NFHhoG"
							
						},
					success: res => {
						// console.error(res)
						debugger
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
</style>
