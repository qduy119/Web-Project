


const db = require("../../utils/db")

module.exports = class PaymentController {
    static Payment = async (req, res) => {
        console.log("=============================")
        console.log("thanh toán")
        console.log("body => ", req.body);
        console.log("cookie => ", req.cookies["token"]);
        console.log("=============================")
        const amount = parseFloat(req.body.amount);
        const idUser = req.body.userId;
        let target = await db.db.query(`
            select * from "paymentAccount" where "userId" = $1
        `, [idUser])
        let balance = parseFloat(target[0].creditBalance);
        if(balance < amount) {
            res.json({status : 404});
            return
        }
        let currDate = new Date().toJSON().slice(0, 10);
        await db.db.none(`
            update "paymentAccount" set "creditBalance" = "creditBalance" + $1 where id = 1;
            update "paymentAccount" set "creditBalance" = "creditBalance" - $1 where "userId" = $2;
            insert into "historyTransfer"("dateTransfer", "creditId", amount, "balanceAfterTransfer", "orderId")
            values ($3, $4, $1, $5, $6)                     
        `, [amount, idUser, currDate, parseInt(target[0].id), balance - amount, parseInt(req.body.orderId)]);
        res.json({status : 200})
    }
}