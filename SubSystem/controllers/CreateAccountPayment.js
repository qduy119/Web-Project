const db = require("../../utils/db.js")

module.exports = class CreateAccountPayment {
    static CreateAccount = async (req, res) => {
        let idUser = parseInt(req.body.userId);
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