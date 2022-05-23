const Users=require('../models/userModel')

const userCtrl = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email })
            
            if (user)
                return res.status(400).json({ msg: "The email already exists" });
            
            if (password.length < 6)
                return res.status(400).json({ msg: "The password could be more than 6 letters" });
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = userCtrl;
