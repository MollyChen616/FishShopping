//数据验证
const filter = {
    //手机号
    phone:function(number){
      let myreg = /^((1[0-9]{1})+\d{9})$/;
      if(myreg.test(number)&&number.length==11){
        return true
      }else{
        return false
      }
    },
    //银行卡
    bankcard:function(number){
      let myreg = /^([1-9]{1})(\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/;
      if(myreg.test(number)){
        return true
      }else{
        return false
      }
    },
    //支付密码
    pwd:function(number){
      let paypwd = /^\d{6}$/
      if(paypwd.test(number)&&number.length==6){
        return true
      }else{
        return false
      }
    },
    quota:function(number) {
      let regu = /^[1-9]\d*$/;
      if(number==""||number>100000000||!regu.test(number)){
        return false
      }else{
        return true
      }
    }
}

export default filter