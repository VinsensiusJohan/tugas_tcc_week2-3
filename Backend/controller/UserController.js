import User from '../model/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// GET
async function getUsers(req, res) {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// GET BY ID
async function getUserById(req, res) {
    try {
        const response = await User.findOne({where:{id: req.params.id}});
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// REGISTER
async function registerUser(req, res) {
    try {
        const { name, password } = req.body;

        const existingUser = await User.findOne({ where: { name } });
        if (existingUser) {
            return res.status(400).json({ msg: "Username sudah digunakan" });
        }

        const encryptedPassword = await bcrypt.hash(password, 5);
        await User.create({
            name: name,
            password: encryptedPassword
        });

        res.status(201).json({ msg: "User berhasil dibuat" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}


// LOGIN
async function loginUser(req, res) {
    try {
        const {name, password} = req.body;
        const user = await User.findOne({where:{name: name}});
        if(user){
            const decryptPassword = await bcrypt.compare(password, user.password);
            const userPlain = user.toJSON();
            const {password:_, refres_token:__, ...safeUserData} = userPlain;
            if(decryptPassword){
                const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
                const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
                await User.update({refres_token: refreshToken},{
                    where:{
                        id: user.id
                    }
                });
                res.cookie('refreshToken', refreshToken,{
                    httpOnly: false,
                    sameSite: 'lax',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000
                });
                res.status(200).json({
                    status: 'success',
                    message: 'Login Success',
                    safeUserData,
                    accessToken,
                })
            }
            else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Wrong Username or Password'
                });
            }
        }
        else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Wrong Username or Password'
                });
            }
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: 'error',
            message: error.message
        });
    }
}

// LOGOUT
async function logoutUser(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findOne({
            where:{refres_token: refreshToken}
        });
        if(!user.refres_token) return res.sendStatus(403);
        const userId = user.id;
        await User.update({refres_token: null},{
            where:{
                id: userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    } catch (error) {
        console.log(error.message);
    }
}

export {
    getUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser
}