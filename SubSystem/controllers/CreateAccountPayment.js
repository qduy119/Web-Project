const db = require("../../utils/db.js")

module.exports = class CreateAccountPayment {
    static CreateAccount = async (req, res) => {
        console.log("==================================")
        console.log("create account payment")
        console.log(req.body);
        console.log("==================================")
        let idUser = req.body.id
        let target = await db.db.query(`select * from "paymentAccount" where "userId" = $1`, [idUser])
        if(target.length !== 0) {
            res.sendStatus(200);
            return
        }
        try{
            await db.db.none(`
                insert into "paymentAccount"("userId") values(${idUser})
            `)
            res.sendStatus(200);
        }catch(e) {
            res.sendStatus(404)
        }
    }
}