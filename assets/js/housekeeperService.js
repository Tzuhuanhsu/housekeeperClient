const SERVICE_ADD = "192.168.0.90:9999"
const SERVICE = `http://${SERVICE_ADD}`;
const API = {
    SET_DATA:SERVICE +"/setData",
    GET_DATA: SERVICE + "/getData",
    GET_ROOM_SETTING: SERVICE + "/getRoomSetting?",
    GET_USER_TYPE:SERVICE + "/getUserType?",
    GET_DOOR_KEY_DATA:SERVICE + "/getDoorKeyData?",
    GET_ROOM_KEY_DATA:SERVICE + "/getRoomKeyData?",
    ADD_DOOR_KEY:SERVICE +"/addDoorKey",
    ADD_ROOM_KEY:SERVICE + "/addRoomKey",
    DELETE_DOOR_KEY:SERVICE + "/deleteDoorKey",
    DELETE_ROOM_KEY:SERVICE + "/deleteRoomKey",
    LOGIN: SERVICE + "/login",
    LOGOUT:SERVICE + "/logout",
    WEBSOCKET: `ws://${SERVICE_ADD}/ws?`
};
const WEBSOCKET_EVENT = {
    OPEN: "OPEN",
    ON_ERROR: "ON_ERROR",
    ON_CLOSE: "ON_CLOSE",
    ON_MESSAGE: "ON_MESSAGE"
}
const WEBSOCKET_SUB_EVENT = {
    ORDER_INFO: "OrderInfo",
    CHECK_IN: "CheckIn",
    DELETE:"DelOrder",
    CHECK_OUT: "CheckOut",
    CHECK_CLEAR: "CheckClear",
    CHECK_PAY: "CheckPay",
    ON_SUCCESS: "OnSuccess",
    ON_FAIL: "OnFail",
    UPDATE: "OrderInfoUpdate",
};

class HousekeeperService
{
    websocket = null
    token = null
    account = null
    constructor()
    {
        this.account = localStorage.account;
        this.token = localStorage.token;
    }

    isLogin()
    {
        return (this.token != null && this.account != null)
    }

    async login(account, password)
    {
        console.log(account, password)
        return new Promise((resolve, _)=>{
            const http = new XMLHttpRequest();
            http.open("post", API.LOGIN, true);
            http.setRequestHeader('Content-type', 'application/json');
            http.send(JSON.stringify({
                "Account": account,
                "Password": password
            }));
            http.onreadystatechange = () =>
            {
                if (http.readyState === 4)
                {
                    resolve({status:http.status, response:http.responseText})
                }
            };
        });
       
    }
    openWebsocket(websocketHandle)
    {
        console.log("openWebsocket")
        let socketUser = `token=${this.token}&account=${this.account}`
        this.websocket = new WebSocket(API.WEBSOCKET + socketUser);
        this.websocket.onopen = function (msg)
        {
            console.log("ws onopen", msg)
            websocketHandle(WEBSOCKET_EVENT.OPEN, msg)
        }
        this.websocket.onerror = function (msg)
        {
            console.error("ws error", e)
            websocketHandle(WEBSOCKET_EVENT.ON_ERROR, msg)
        }

        //websocket on close
        this.websocket.onclose = function (msg) 
        {
            console.log("webSocket on close", msg)
            websocketHandle(WEBSOCKET_EVENT.ON_CLOSE, msg)
        }
        //websocket receive message
        this.websocket.onmessage = function (msg)
        {
            websocketHandle(WEBSOCKET_EVENT.ON_MESSAGE, msg)

        };
    }

    requestOrder(successCallback)
    {
        const http = new XMLHttpRequest();
        http.open("get", API.GET_DATA, true);
        http.send();
        http.onreadystatechange = () =>
        {
            if (http.readyState === 4 && http.status == 200 && http.responseText != null)
            {
                successCallback(JSON.parse(http.responseText))
            }
        };
    }

    addOrder(order, callback)
    {
        const http = new XMLHttpRequest();
        http.open("POST", API.SET_DATA, true);
        http.setRequestHeader("Content-Type", "application/json");
        http.onreadystatechange = function ()
        {
            if (http.readyState === 4)
            {
                callback(http.status, http.responseText)
            }
        };
       
        //add user token
        order["Account"] = this.account
        order["Token"] = this.token
        var postData = JSON.stringify(order);
        console.log("postData", postData)
        http.send(postData)
    }

    // 刪除房間金鑰
    async deleteRoomKey(data)
    {
        return new Promise((resolve, _)=>
        {
            const http = new XMLHttpRequest();
             http.open("POST", API.DELETE_ROOM_KEY, true);
             http.setRequestHeader("Content-Type", "application/json");
             http.onreadystatechange = function ()
             {
                 if (http.readyState === 4)
                 {
                    resolve({status:http.status, response:http.responseText});
                 }
             };
             //add user token
             data["Account"] = this.account
             data["Token"] = this.token
             var postData = JSON.stringify(data);
             console.log("postData", postData)
             http.send(postData)
        });
    }
    // 刪除大門鑰匙
    async deleteDoorKey(data)
    {
        return new Promise((resolve, _)=>
        {
            const http = new XMLHttpRequest();
             http.open("POST", API.DELETE_DOOR_KEY, true);
             http.setRequestHeader("Content-Type", "application/json");
             http.onreadystatechange = function ()
             {
                 if (http.readyState === 4)
                 {
                    resolve({status:http.status, response:http.responseText});
                 }
             };
         
             //add user token
             data["Account"] = this.account
             data["Token"] = this.token
             var postData = JSON.stringify(data);
             console.log("postData", postData)
             http.send(postData)
        });
    }
    // add room key
    async addRoomKey(data)
    {
        return new Promise((resolve, reject)=>{
            const http = new XMLHttpRequest();
             http.open("POST", API.ADD_ROOM_KEY, true);
             http.setRequestHeader("Content-Type", "application/json");
             http.onreadystatechange = function ()
             {
                 if (http.readyState === 4)
                 {
                     console.log("success");
                     if(http.status==200)
                         resolve(http.status);
                     else
                         reject(http.responseText);
                 }
             };
         
             //add user token
             data["Account"] = this.account
             data["Token"] = this.token
             var postData = JSON.stringify(data);
             console.log("postData", postData)
             http.send(postData)
         });
    }
    // add door key
    async addDoorKey(data)
    {
        return new Promise((resolve, reject)=>{
           const http = new XMLHttpRequest();
            http.open("POST", API.ADD_DOOR_KEY, true);
            http.setRequestHeader("Content-Type", "application/json");
            http.onreadystatechange = function ()
            {
                if (http.readyState === 4)
                {
                    console.log("success");
                    if(http.status==200)
                        resolve(http.status);
                    else
                        resolve(http.responseText);
                }
            };
        
            //add user token
            data["Account"] = this.account
            data["Token"] = this.token
            var postData = JSON.stringify(data);
            console.log("postData", postData)
            http.send(postData)
        });
    }
    
    // 取得每間房間的設定
    getRoomSetting(callback)
    {
        let userData = `token=${this.token}&account=${this.account}`;
        const http = new XMLHttpRequest();
        http.open("get", API.GET_ROOM_SETTING + userData, true);
        http.send();
        http.onreadystatechange = () =>
        {
            if (http.readyState === 4)
            {
                callback(http.status, http.responseText)
            }
        };
    }
    // 取得大門鑰匙資訊
    async getDoorKeyData()
    {
        return new Promise((resolve, _)=>{
            let userData = `token=${this.token}&account=${this.account}`;
            const http = new XMLHttpRequest();
            http.open("get", API.GET_DOOR_KEY_DATA + userData, true);
            http.send();
            http.onreadystatechange = () =>
            {
                if (http.readyState === 4)
                {
                    resolve({status:http.status, response:http.responseText});
                }
            };
        });
        
    }

    // 取得房間鑰匙資訊
    async getRoomKeyData(callback)
    {
        return new Promise((resolve, _)=>{
            let userData =  `token=${this.token}&account=${this.account}`;
            const http = new XMLHttpRequest();
            http.open("get", API.GET_ROOM_KEY_DATA + userData, true);
            http.send();
            http.onreadystatechange = () =>
            {
                if (http.readyState === 4)
                {
                    resolve({status:http.status, response:http.responseText});
                }
            };
        })
       
    }
    checkIn(orderId)
    {
        if (this.websocket.readyState == WebSocket.OPEN)
        {
            this.websocket.send(JSON.stringify(
                {
                    "event": WEBSOCKET_SUB_EVENT.CHECK_IN,
                    "content": {
                        "orderId": orderId,
                        "account": this.account
                    },
                }));
        }
        else
        {
            console.log("Service state", this.websocket.readyState, "can't send commend")
        }
    }
    
    deleteOrder(orderId)
    {
        if (this.websocket.readyState == WebSocket.OPEN)
        {
            this.websocket.send(JSON.stringify(
                {
                    "event": WEBSOCKET_SUB_EVENT.DELETE,
                    "content": {
                        "orderId": orderId,
                        "account": this.account
                    },
                }));
        }
        else
        {
            console.log("Service state", this.websocket.readyState, "can't send commend")
        }
    }
    checkOut(orderId)
    {
        console.log("check out", orderId)
        if (this.websocket.readyState == WebSocket.OPEN)
        {
            this.websocket.send(JSON.stringify(
                {
                    "event": WEBSOCKET_SUB_EVENT.CHECK_OUT,
                    "content": {
                        "orderId": orderId,
                        "account": this.account
                    },
                }));
        }
        else
        {
            console.log("Service state", this.websocket.readyState, "can't send commend")
        }
    }

    checkClear(orderId)
    {
        console.log("check out", orderId)
        if (this.websocket.readyState == WebSocket.OPEN)
        {
            this.websocket.send(JSON.stringify(
                {
                    "event": WEBSOCKET_SUB_EVENT.CHECK_CLEAR,
                    "content": {
                        "orderId": orderId,
                        "account": this.account
                    },
                }));
        }
        else
        {
            console.log("Service state", this.websocket.readyState, "can't send commend")
        }
    }

    pay(orderId)
    {
        console.log("pay", orderId)
        if (this.websocket.readyState == WebSocket.OPEN)
        {
            this.websocket.send(JSON.stringify(
                {
                    "event": WEBSOCKET_SUB_EVENT.CHECK_PAY,
                    "content": {
                        "orderId": orderId,
                        "account": this.account
                    },
                }));
        }
        else
        {
            console.log("Service state", this.websocket.readyState, "can't send commend")
        }
    }
    // 取得User的類別
    getUserType(callback)
    {
        console.log("getUserType");
        let userData = `token=${this.token}&account=${this.account}`
        const http = new XMLHttpRequest();
        http.open("get", API.GET_USER_TYPE + userData, true);
        http.send();
        http.onreadystatechange = () =>
        {
            if (http.readyState === 4)
            {
                callback(http.status, http.responseText)
            }
        };
    }

    logout()
    {
        const http = new XMLHttpRequest();
        if(this.websocket)
        {
            this.websocket.onopen = null
            this.websocket.onerror = null
            this.websocket.onclose = null
            this.websocket.onmessage = null
        }
        
        this.websocket = null
        http.open("post", API.LOGOUT, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.send(JSON.stringify({
            "Account":  this.account,
            "Token": this.token
        }));
        http.onreadystatechange = () =>
        {
            if (http.readyState === 4)
            {
                console.log(this.websocket)
                window.alert("登出")
                localStorage.removeItem("account")
                localStorage.removeItem("token")
                console.log("logoutHref", window.location.href)
                window.location.href = "login.html"
            }
        };
    }
}