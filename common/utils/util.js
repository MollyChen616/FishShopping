//工具函数
const util = {
    //时间戳格式化
    time:function(num){
		 var now = new Date(num*1000);
		 var   year=now.getFullYear();    
         var   month=now.getMonth()+1;    
         var   date=now.getDate();    
         var   hour=now.getHours();    
         var   minute=now.getMinutes();    
         var   second=now.getSeconds();    
         return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;    
    },
	//数组去重
	uniq:function(array){
		var temp = [];
		for(var i = 0; i < array.length; i++) {
			//如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
			if(array.indexOf(array[i]) == i){
				temp.push(array[i])
			}
		}
		return temp;
	},
	//版本号比较,大于返回true 小于和等与返回false
    compare:function(val1,val2){
      var version1pre = parseFloat(val1);
      var version2pre = parseFloat(val2);
      var version1next =  val1.replace(version1pre + ".","");
      var version2next =  val2.replace(version2pre + ".","");
      if(version1pre > version2pre){
          return true;
      }else if(version1pre < version2pre){
          return false;
      }else{
          if(version1next > version2next){
              return true;
          }else{
              return false;
          }
      }
    }
}

export default util