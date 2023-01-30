const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const userCtrl = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email })
            
            if (user)
                return res.status(400).json({ msg: "The email already exists" });
            // if (!user)
                // return res.status(200).json({ msg: "Email Found" });
            
            if (password.length < 6)
                return res.status(400).json({ msg: "The password could be more than 6 letters" });
            //password encryption
            const passwordhash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordhash
            })
            
            //save mongodb
            await newUser.save()
            //res.json({password, passwordhash})

            //create json webtoken to authenticate
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })
            
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path:'/uesr/refresh_token'
                
            })


            res.json({msg:"Registered Success",refreshtoken,accesstoken})
            //res.json({ accesstoken })
            
            //res.json({ msg: "Registered Success" })
            
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login:async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "User does not exist" });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Incorrect Password" });
            
            //if login success,create the accessToken and refreshToken
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })
            
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path:'/uesr/refresh_token'
    
            })
            res.json({msg:"Login Success",refreshtoken,accesstoken})
 
        } catch (err) {
            return res.status(500).json({ msg: err.message });
         }
    },
    logout:async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({msg:"logged Out"})
            
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    refreshtoken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login or Register1" })
             
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

                if (err) return res.status(400).json({ msg: "Please Login or Register" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({accesstoken})
            })
            
            //res.json({ rf_token });

        }
        catch (err) {
            return res.status(500).json({msg:err.message})
        }
        
        
    },
    getuser: async (req, res) => {
        try {
            res.json(req.user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

}

const createAccessToken = (user) => {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
    
}
const createRefreshToken = (user) => {
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}

module.exports = userCtrl;
