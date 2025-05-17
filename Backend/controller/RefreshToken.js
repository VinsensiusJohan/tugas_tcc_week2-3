import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async(req, res) =>{
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log("Refresh Token: ", refreshToken);
        if(!refreshToken) return res.sendStatus(401);
        console.log("Pass 401 Authcontroller");
        const user = await User.findOne({
            where:{refres_token: refreshToken}
        });
        if(!user.refres_token) return res.sendStatus(403);
        else jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            console.log("Pass 403 ke 2 Authcontroller");
            const userPlain = user.toJSON();
            const {password:_, refres_token:__, ...safeUserData} = userPlain;
            const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
            res.json({accessToken});
        });
    } catch (error) {
        console.log("Error: ", error);
    }
}