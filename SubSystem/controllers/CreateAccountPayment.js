const db = require("../../utils/db.js");

module.exports = class CreateAccountPayment {
    static CreateAccount = async (req, res) => {
        console.log("==================================");
        console.log("create account payment");
        console.log(req.body);
        console.log("==================================");
        let idUser = req.body.id;
        let target = await db.db.query(
            `select * from "paymentAccount" where "userId"::text = '${idUser}'`
        );
        if (target.length !== 0) {
            return res.status(200).json({ status: 200 });
        }
        try {
            await db.db.none(`
                insert into "paymentAccount"("userId") values('${idUser}');
            `);
            res.status(200).json({ status: 200 });
        } catch (e) {
            console.log(e);
            res.status(404).json({ status: 404 });
        }
    };
};
