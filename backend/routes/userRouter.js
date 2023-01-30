const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth =require('../middleware/auth')


router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout',userCtrl.logout)
router.get('/refresh_token', userCtrl.refreshtoken)
router.get('/infor',auth,userCtrl.getuser)

module.exports = router;