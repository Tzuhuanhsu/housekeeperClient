const TW_Money_Mark = "NT$";

class HouseKeeper
{
    revenueTxt = document.getElementById("revenue_For_Month_txt");
    thisMonthTxt = document.getElementById("this_month");
    unpaidTxt = document.getElementById("Unpaid_txt");
    annualRevenueTxt = document.getElementById("annual_revenue");
    orderListTab = document.querySelector("tbody");
    logoutBtn = document.getElementById("logout-button");
    orderMgr = new orderMgr();
    serviceMgr = new HousekeeperService();
    constructor()
    {
        console.log("Running housekeeper", this.serviceMgr);
        this.addBtnListener();
        if (this.serviceMgr.isLogin() == false)
        {
            window.location.href = "login.html";
        } else
        {
            this.serviceMgr.openWebsocket(this.websocketHandle.bind(this));
        }
    }

    websocketHandle(event, msg)
    {
        console.log("websocket Handle", event, msg);
        switch (event)
        {
            case WEBSOCKET_EVENT.ON_CLOSE:
                this.serviceMgr.logout();
                break;
            case WEBSOCKET_EVENT.ON_MESSAGE:
                {
                    let subSocketData = JSON.parse(msg.data);
                    console.log(subSocketData)
                    switch (subSocketData.event)
                    {
                        case WEBSOCKET_SUB_EVENT.ORDER_INFO:
                            //取得訂單資訊
                            this.orderMgr.Orders = subSocketData.content;
                            this.refreshUI();
                            break;
                        case WEBSOCKET_SUB_EVENT.ON_SUCCESS:
                            window.alert(subSocketData.content);
                            break;
                        case WEBSOCKET_SUB_EVENT.ON_FAIL:
                            window.alert(subSocketData.content);
                            break;
                        case WEBSOCKET_SUB_EVENT.UPDATE:
                            //更新訂單資訊
                            this.orderMgr.Orders = subSocketData.content;
                            this.refreshUI();
                            break;
                    }
                }
                break;
        }
    }

    addBtnListener()
    {
        this.logoutBtn.addEventListener("click", () =>
        {
            console.log("logout");
            this.serviceMgr.logout();
        });
    }
    requestOrder()
    {
        this.serviceMgr.requestOrder((orders) =>
        {
            this.orderMgr.Orders = orders;
            this.refreshUI();
        });
    }

    refreshUI()
    {
        var date = new Date();
        this.revenueTxt.innerHTML = `${TW_Money_Mark} ${this.thousands(
            this.orderMgr.getThisMonRevenue()
        )}`;
        this.thisMonthTxt.innerHTML = `${date.getMonth() + 1}月民宿收入`;
        this.unpaidTxt.innerHTML = `${TW_Money_Mark} ${this.thousands(
            this.orderMgr.getUnPaidMoney()
        )}`;
        this.annualRevenueTxt.innerHTML =`${TW_Money_Mark} ${this.thousands(
            this.orderMgr.getAnnualRevenue()
        )}`;
        this.refreshOrderLisTab();
    }

    refreshOrderLisTab()
    {
        this.orderListTab.innerHTML = "";
        for (const [key, value] of Object.entries(this.orderMgr.orders))
        {
            let tr = document.createElement("tr");
            this.orderListTab.appendChild(tr);

            //order id
            let orderIdTd = document.createElement("td");
            orderIdTd.innerHTML = key;
            tr.appendChild(orderIdTd);

            //Room type
            let roomTypeTd = document.createElement("td");
            roomTypeTd.innerHTML = value.RoomType;
            tr.appendChild(roomTypeTd);

            //住房人數
            let numberOfPeopleTd = document.createElement("td");
            numberOfPeopleTd.innerHTML = value.NumberOfPeople;
            tr.appendChild(numberOfPeopleTd);

            //入住時間
            let liveTimeTd = document.createElement("td");
            liveTimeTd.innerHTML = `${value.CheckInData} ~ ${value.CheckOutData}`;
            tr.appendChild(liveTimeTd);

            //說明
            let explainTd = document.createElement("td");
            explainTd.innerHTML = value.RoomExplain;
            tr.appendChild(explainTd);
            //金額
            let orderCostTd = document.createElement("td");
            orderCostTd.innerHTML = value.Cost;
            tr.appendChild(orderCostTd);
            //訂單狀態
            let orderStatusTd = document.createElement("td");
            orderStatusTd.innerHTML = `${value.Paid == true
                ? PAY_STATUS_WITH_HTML.Paid
                : PAY_STATUS_WITH_HTML.NoPay
                }
                ,${ORDER_STATUS_WITH_HTML[value.OrderStatus]}`;

            this.addOrderClickEvent(value, orderStatusTd);
            tr.appendChild(orderStatusTd);
        }
    }

    addOrderClickEvent(order, orderStatusTd)
    {
        if (order.Paid == false)
        {
            orderStatusTd
                .querySelector("#Pay_order")
                .addEventListener("click", () =>
                {
                    this.serviceMgr.pay(order.OrderId)
                });
        }

        switch (order.OrderStatus)
        {
            case ORDER_STATUS.Reserve:
                orderStatusTd
                    .querySelector("#Reserve_order")
                    .addEventListener("click", () =>
                    {
                        this.serviceMgr.checkIn(order.OrderId);
                    });
                orderStatusTd
                    .querySelector("#Delete_order")
                    .addEventListener("click", ()=>
                    {
                        this.serviceMgr.deleteOrder(order.OrderId);
                    })
                break;
            case ORDER_STATUS.CheckIn:
                orderStatusTd
                    .querySelector("#checkOut_order")
                    .addEventListener("click", () =>
                    {
                        this.serviceMgr.checkOut(order.OrderId);
                    });
                break;
            case ORDER_STATUS.WaitClear:
                orderStatusTd
                    .querySelector("#clear_check")
                    .addEventListener("click", () =>
                    {
                        this.serviceMgr.checkClear(order.OrderId);
                    });
                break;
        }
    }

    thousands(value)
    {
        if (value)
        {
            value += "";
            var arr = value.split(".");
            var re = /(\d{1,3})(?=(\d{3})+$)/g;

            return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
        } else
        {
            return "0";
        }
    }
}

//run housekeeper mgr

let houseKeeper = new HouseKeeper();
window.onload = function ()
{
    houseKeeper.refreshUI();
};
