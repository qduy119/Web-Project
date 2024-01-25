const jwt = require("jsonwebtoken")
const  authenAccount = (req, res, next) => {
    const tokenAccess = req.cookies.tokenAccess;
    if (!tokenAccess) {
          res.sendStatus(401);//chua dang nhap
          return;
    }; //authorize
  
    jwt.verify(tokenAccess, process.env.SUBSYTEM_SECRET_KEY_TOKEN, (err, data) => {
          if (err){
                res.sendStatus(403);//forbidden     
                return;
          }
          else{
                next();
          }
    });
}

module.exports = authenAccount;