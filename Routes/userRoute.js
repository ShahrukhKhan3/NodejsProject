const express = require('express');
const authController = require('../controller/authController');
const userController=require('../controller/userController');
const router = express.Router();



router.post('/register', authController.signup);
router.post('/logins', authController.login);
router.get('/protected', authController.protect);



router.get('/signup', userController.signup);
router.get('/login', userController.login);


router.get('/get',userController.getAllUser );
router.get('/getupdate/:id',userController.getupdateUser );
router.post('/create', userController.createUsers);
router.get('/forgot', userController.forgot);
router.post('/forgotPassword', userController.forgotPassword);

router.post('/updateMyPassword/:id',authController.updatePassword);

router.get('/updateMyPassword/:id', userController.updatePassword);


// router.patch('/resetPassword/:token', userController.resetPassword);

router.post('/getupdate/:id', userController.getupdated);


router.get('/update/:id', userController.update);
router.get('/delete/:id', userController.deleteuser);






module.exports = router;