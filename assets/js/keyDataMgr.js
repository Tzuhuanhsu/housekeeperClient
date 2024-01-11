const USER_TYPE = {
    UNKNOWN:-1,
    BOSS:1,
    JANITOR:2,
    HOUSEKEEPER:3
}
const Option =
{
    DeleteDoorPwd: '<a href="javascript:;" id="deleteDoorPwd"><i class="far fa-trash-alt"></i>刪除</a>',
    DeleteRoomPwd: '<a href="javascript:;" id="deleteRoomPwd"><i class="far fa-trash-alt"></i>刪除</a>',
}
class KeyDataMgr
{
   

    houseService = new HousekeeperService();
    userType = USER_TYPE.BOSS;
    htmlDoorKeyData = document.getElementById("Door_Key_Data");
    htmlDoorKeyOption = document.getElementById("Door_Key_Option");
    htmlRoomKeyData = document.getElementById("Room_Key_Data");
    htmlRoomKeyOption = document.getElementById("Room_Key_Option");
    htmlDoorTable = document.getElementById("Door_table");
    htmlRoomTable = document.getElementById("Room_table");
    htmlAddDoorKeyBut =document.getElementById("submit_DoorKey")
    htmlAddRoomKeyBut = document.getElementById("submit_RoomKey")
    htmlRoomTypeSelect = document.getElementById("room_type_select")
    
    roomSetting = {}
    constructor()
    {
        if(!this.houseService.isLogin())
            this.houseService.logout();
        else
        {
            this.htmlDoorKeyData.style.visibility = "hidden";
            this.htmlDoorKeyOption.style.visibility = "hidden";
            this.htmlRoomKeyData.style.visibility = "hidden";
            this.htmlRoomKeyOption.style.visibility = "hidden";
            this.addButtonListener();
        } 
    }
    
    addButtonListener()
    {
        //add door key
        this.htmlAddDoorKeyBut.addEventListener('click', async ()=>
        {
            let now = new Date();
            let day = now.getDate();
            let month = now.getMonth() + 1;
            let year = now.getFullYear();
            let today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            let regex = /^#[0-9]+#$/;
            
            if(document.getElementById("door_Id").value.trim()=="")
            {
                window.alert("請輸入訂單編號");
                return;
            }
            if(document.getElementById("door_Key").value.trim() ==""){
                window.alert("密碼不能為空");
                return;
            }
            if(!regex.test(document.getElementById("door_Key").value.trim()))
            {
                window.alert("密碼格式應為#{pwd}#");
                return;
            }
            if(today > new Date(document.getElementById("door_BeginDate").value)){
                window.alert("請檢查日期是否有效");
                return;
            }
           
            if(document.getElementById("door_BeginDate").value > document.getElementById("door_EndDate").value){
                window.alert("請檢查日期是否有效 begin data > end date");
                return;
            }
            let keyData = {
                "Id": document.getElementById("door_Id").value.trim(),
                "DoorKey": document.getElementById("door_Key").value.trim(),
                "BeginTime": document.getElementById("door_BeginDate").value,
                "EndTime": document.getElementById("door_EndDate").value
            }
            const ack  = await this.houseService.addDoorKey(keyData);
            if (ack==200)
            {
                window.alert("新增成功");
                window.location.reload();
            }
            else
                window.alert(ack);
        });
        //add room key
        this.htmlAddRoomKeyBut.addEventListener('click',async ()=>
        {
            let now = new Date();
            let day = now.getDate();
            let month = now.getMonth() + 1;
            let year = now.getFullYear();
            let today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            let regex = /^#[0-9]+#$/;
        
            if(document.getElementById("room_Id").value.trim()=="")
            {
                window.alert("請輸入訂單編號");
                return;
            }
            if(document.getElementById("room_Key").value.trim() ==""){
                window.alert("密碼不能為空");
                return;
            }
            if(!regex.test(document.getElementById("room_Key").value.trim()))
            {
                window.alert("密碼格式應為#{pwd}#");
                return;
            }
            if(today > document.getElementById("room_BeginDate").value){
                window.alert("請檢查日期是否有效");
                return;
            }
            if( document.getElementById("room_BeginDate").value > document.getElementById("room_EndDate").value){
                window.alert("請檢查日期是否有效 begin data > end date");
                return;
            }
            if(Number(document.getElementById("room_type_select").value)==-1)
            {
                window.alert("請選擇房型");
                return;
            }
            let keyData = {
                "Id": document.getElementById("room_Id").value.trim(),
                "RoomKey": document.getElementById("room_Key").value.trim(),
                "RoomType":Number(document.getElementById("room_type_select").value),
                "BeginTime":  document.getElementById("room_BeginDate").value,
                "EndTime": document.getElementById("room_EndDate").value
            }
            console.log("Add room key", keyData);
            const ack  = await this.houseService.addRoomKey(keyData);
            if (ack==200)
            {
                window.alert("新增成功");
                window.location.reload();
            }
            else
                window.alert(ack);
        });
    }
   async getRoomSetting()
    {
        return new Promise((resolve, reject)=>{
        this.houseService.getRoomSetting((statusCode, responseTxt) =>
        {
           
            if (statusCode == 200)
            {
                const roomSetting = JSON.parse(responseTxt)
                this.roomSetting = roomSetting
    
                for (const [key, value] of Object.entries(roomSetting))
                {
                    let option = document.createElement("option");
                    option.innerHTML = value;
                    option.value = key
                    this.htmlRoomTypeSelect.appendChild(option);
                    resolve(); 
                }
            }
            else
            {
                window.alert("無法取得房間設定代號",responseTxt);
                window.location.href = "login.html";
                reject()
            }
          
        });
        });
        
    }
    //顯示門鎖資料
    showData()
    {
        this.htmlDoorKeyData.style.visibility = "visible";
        this.htmlRoomKeyData.style.visibility = "visible";
    }
    //開啟門鎖操作
    openOption()
    {
        this.htmlDoorKeyOption.style.visibility = "visible";
        this.htmlRoomKeyOption.style.visibility = "visible";
    }

    // 取得使用者類別
    getUserType()
    {
        this.houseService.getUserType((statusCode, responseTxt)=>
        {
            if (statusCode == 200)
            {
                const roomSetting = JSON.parse(responseTxt)
                console.log(roomSetting)
                this.refreshUI();
            }
               
            else
            {
                window.alert("無法判別使用者",responseTxt);
                window.location.href = "login.html";
            }
            this.refreshUI();
        })
    }
    
    refreshUI()
    {
        switch(this.userType)
        {
            case USER_TYPE.BOSS:
                this.showData();
                this.openOption();    
            break;
            case USER_TYPE.JANITOR:
                this.showData();
                this.openOption(); 
            break;
            case USER_TYPE.HOUSEKEEPER:
                this.showData();
            break;
            default:
                console.log("無法識別使用者類別");
                break;

        }
    }
    // 請求大門鑰匙資料
    async getDoorKeyDate()
    {
        const response = await this.houseService.getDoorKeyData();
      
        if(response.status===200)
        {
            //Success
            for (const [_, value] of Object.entries(JSON.parse(response.response)))
            {
                const tr = document.createElement("tr");
                this.htmlDoorTable.appendChild(tr);
                //order id
                const orderIdTd = document.createElement("td");
                orderIdTd.innerHTML = value["Id"];
                tr.appendChild(orderIdTd);
                //Door Key
                const doorKey = document.createElement("td");
                doorKey.innerHTML = value["DoorKey"];
                tr.appendChild(doorKey);
                //expiry
                const expiry = document.createElement("td");
                expiry.innerHTML = `${value["BeginTime"]} --> ${value["EndTime"]}`
                tr.appendChild(expiry)
                if(this.userType<USER_TYPE.HOUSEKEEPER)
                    {
                        const option = document.createElement("td")
                        option.innerHTML = Option.DeleteDoorPwd;
                        option
                            .querySelector("#deleteDoorPwd")
                            .addEventListener("click", async () =>
                            {
                                const ack = await this.houseService.deleteDoorKey(value);
                                window.alert(ack.response);
                                window.location.reload();
                            });
                        tr.appendChild(option);
                    }
                }
            }
        else
        {
            console.error("keyDataMgr getDoorKeyDate fail",response);
        }
    }
    // 請求房間鑰匙資料
    async getRoomKeyData()
    {
        const response = await this.houseService.getRoomKeyData();
     
        if(response.status==200)
        {
            let sortResult = {}
            const entries =  Object.entries(JSON.parse(response.response));
                
            entries.sort((x, y) => 
            {
                return (x[1].RoomType - y[1].RoomType)
            });
            entries.forEach((element) => sortResult[element[0]] = element[1]);

            //Success
            for (const [_, value] of  Object.entries(sortResult))
            {
                const tr = document.createElement("tr");
                this.htmlRoomTable.appendChild(tr);
                //order id
                const orderIdTd = document.createElement("td");
                orderIdTd.innerHTML = value["Id"];
                tr.appendChild(orderIdTd);
                //room Key
                const roomKey = document.createElement("td");
                roomKey.innerHTML = value["RoomKey"];
                tr.appendChild(roomKey);
                //expiry
                const expiry = document.createElement("td");
                expiry.innerHTML = `${value["BeginTime"]} --> ${value["EndTime"]}`
                tr.appendChild(expiry);
                //room number
                const roomNumber = document.createElement("td");
                roomNumber.innerHTML =  this.roomSetting[value["RoomType"]];
                tr.appendChild(roomNumber);
                if(this.userType<USER_TYPE.HOUSEKEEPER)
                {
                    const option = document.createElement("td")
                    option.innerHTML = Option.DeleteRoomPwd;
                    option
                        .querySelector("#deleteRoomPwd")
                        .addEventListener("click", async () =>
                        {
                            const ack = await this.houseService.deleteRoomKey(value);
                            window.alert(ack.response);
                            window.location.reload();
                        });
                    tr.appendChild(option);
                }
            }
        }
       
    }
}

window.onload= function()
{
    console.log("onLoad Key data ");
    var keyDataMgr = new KeyDataMgr()
    new Promise( async () => {
        await keyDataMgr.getRoomSetting();
        keyDataMgr.getRoomKeyData();
    }) ;


    keyDataMgr.getUserType();
    keyDataMgr.getDoorKeyDate();
}