const db = require("../../utils/db.js")

module.exports = class CreateAccountPayment {
    static CreateAccount = async (req, res) => {
        console.log("==================================")
        console.log("create account payment")
        console.log(req.body);
        console.log(req.cookies.jwt);
        console.log("==================================")
        let idUser = req.body.id
        try{
            await db.db.none(`
                insert into "paymentAccount"("userId") values(${idUser})
            `)
            res.json({status : 200});
        }catch(e) {
            res.json({status : 401});
        }
    }
}