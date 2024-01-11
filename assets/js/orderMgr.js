
const ORDER_STATUS = {
    Unknown: 0,
    //預定
    Reserve: 1,
    //等待入住
    WaitCheckIn: 2,
    //入住
    CheckIn: 3,
    //等待清潔
    WaitClear: 4,
    //確認清潔
    WaitClearCheck: 5,
    //清潔完成
    ClearFinish: 6
}

const ORDER_STATUS_WITH_HTML =
{
    //Reserve
    [ORDER_STATUS.Reserve]: '<i class="fas fa-book-medical"></i>預定<a href="javascript:;" id="Reserve_order">(點擊切換成入住)</a>/<a href="javascript:;" id="Delete_order">(點擊刪除)</a>',
    //等待入住
    [ORDER_STATUS.WaitCheckIn]: '<i class="fa-light fa-check"></i>房間準備完成',
    //入住
    [ORDER_STATUS.CheckIn]: '<i class="fas fa-house-user"></i>已入住<a href="javascript:;" id="checkOut_order"><i class="fas fa-sign-out-alt"></i>(退房)</a>',
    //等待清潔
    [ORDER_STATUS.WaitClear]: '<i class="fas fa-broom"></i>等待清潔<a href="javascript:;" id="clear_check"><i class="fas fa-sign-out-alt"></i>(清潔完成)</a>',
    //清潔完成
    [ORDER_STATUS.ClearFinish]: '<i class="fa-light fa-check"></i>清潔完成'
}

const PAY_STATUS_WITH_HTML =
{
    NoPay: '<i class="fa-solid fa-money-bill"></i>尚未付款<a href="javascript:;" id="Pay_order">(郎客啊付錢)</a>',
    Paid: '<i class="fa-light fa-check"></i> 付款完成'
}
class orderMgr
{
    orders = {}

    set Orders(order)
    {
        let sortOrder = {}
        const entries = Object.entries(order);
        entries.sort((x, y) => 
        {
            return -(new Date(x[1].CheckInData).getTime() - new Date(y[1].CheckInData).getTime())
        });
        entries.forEach((element) => sortOrder[element[0]] = element[1]);
        this.orders = sortOrder
    }


    get Orders()
    {
        return this.orders
    }

    getOrderById(orderId)
    {
        if (this.orders[orderId])
        {
            return this.orders[orderId]
        }
        return null;
    }


    getThisMonRevenue()
    {
        let revenue = 0
        let now = new Date()
        let thisMothFirstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        let thisMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        for (const [_, value] of Object.entries(this.Orders)) 
        {
            let checkInTDate = new Date(value.CheckInData)
            if (checkInTDate >= thisMothFirstDay && checkInTDate <= thisMonthLastDay)
            {
                if (value.Paid == true)
                {
                    revenue += value.Cost
                }
            }
        }
        return revenue
    }

    getUnPaidMoney()
    {
        let unpaidMoney = 0

        for (const [_, value] of Object.entries(this.Orders)) 
        {
            if (value.Paid == false)
            {
                unpaidMoney += value.Cost
            }
        }

        return unpaidMoney
    }

    getAnnualRevenue()
    {
        let revenue = 0
        for (const [_, value] of Object.entries(this.Orders)) 
        {
            if (value.Paid == true)
            {
                revenue += value.Cost
            }
        }
        return revenue
    }
}