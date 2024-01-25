const authenSystem = (req, res, next) => {
    const token = req.cookies["jwt"];
    if (!token) {
        res.sendStatus(401);//chua dang nhap
        return;
    }; //authorize

    jwt.verify(token, process.env.SUBSYTEM_SECRET_KEY_TOKEN, (err, data) => {
        if (err) {
            res.sendStatus(403);//forbidden     
            return;
        }
        else {
            jwt.verify(req.cookies.tokenuser, process.env.SUBSYTEM_SECRET_KEY_TOKEN, (error , da) => {
                if(error){
                    res.sendStatus(403);
                    return;
                }
                else if(da.id !== data.id){
                    res.sendStatus(403);
                    return;
                }
            })
            next();
        }
    });
}

module.exports = authenSystem;