import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Auth Header: ", req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    console.log("401 verifyed");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
        if(err) return res.sendStatus(403);
        console.log("403 verifyed");
        req.user = decoded;
        next();
    })
}