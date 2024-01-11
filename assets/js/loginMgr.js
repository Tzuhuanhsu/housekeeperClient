
class LoginMgr{
    accountEditBox= document.getElementById("user-acc");
    passwordEditBox = document.getElementById("user-pwd");
    submitBtn = document.getElementById("submitBtn")
    serviceMgr = new HousekeeperService()
    
    constructor()
    {
        if(this.serviceMgr.isLogin())
        {
            //防呆避免 User 未登出
            this.serviceMgr.logout()
        }
        this.addListener()
    }
    addListener()
    {
        this.submitBtn.addEventListener('click',async ()=>{
            if(this.accountEditBox.value=="" || this.passwordEditBox.value=="")
            {
                window.alert("帳號密碼不得空白")
                return
            }

            const ack = await this.serviceMgr.login(this.accountEditBox.value, this.passwordEditBox.value)
            //login success
            if(ack.status==200)
            {
                localStorage.account = this.accountEditBox.value;
                localStorage.token = ack.response;
                window.location.href = "index.html"
            }
            else
            {
                window.alert(statusCode==0?"網路連線異常，請求塔台支援！！":responseText)
            };
        })
    }
}
var loginMgr = new LoginMgr()