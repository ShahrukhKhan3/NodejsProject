const crypto=require('crypto');
const express = require('express');
const bcrypt = require('bcrypt');
const Userdbs = require('../Modal/CrudUser');
const User = require('../Modal/UserModal');
const jwt = require('jsonwebtoken');
const app = express()
const sendEmail = require('../utils/email');


exports.getAllUser = async (req, res) => {
    // try {
    //     const users = await User.find();
    //     res.send({
    //         status: 'success',
    //         data: {
    //             users
    //         }
    //     })
    // } catch (error) {
    //     res.send({
    //         status: 'failed',
    //         message: 'No user found'
    //     })
    // }


    // res.sendFile(__dirname + "/index.html")
    // res.redirect('/index.html')
    const AllUsers = Userdbs.find({}, function (error, user) {
        res.render('index', {
            userList: user
        })
    })
}

exports.getupdateUser = async (req, res) => {
    // try {
    //     const users = await User.find();
    //     res.send({
    //         status: 'success',
    //         data: {
    //             users
    //         }
    //     })
    // } catch (error) {
    //     res.send({
    //         status: 'failed',
    //         message: 'No user found'
    //     })
    // }


    // res.sendFile(__dirname + "/index.html")
    // res.redirect('/index.html')
    const update = await Userdbs.findById(req.params.id, (error, doc) => {
        res.render('update', { ussr: doc })
    }).clone();

}
exports.getupdated = async (req, res) => {
    const updateform = await User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        console.log('update')
        res.redirect('http://localhost:4000/api/v1/users/get');
    }).clone();

}





exports.createUsers = async (req, res) => {
    try {
        const newUser = Userdbs.create(req.body);

        res.send({
            status: 'success',
            data: {
                newUser
            }
        })
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'Sorry'
        })
    }
}

exports.update = async (req, res) => {
    try {
        const users = await Userdbs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'invalid tour data'
        })
    }


};


exports.deleteuser = async (req, res) => {
    try {
        const tours = await Userdbs.findByIdAndDelete(req.params.id)

        console.log('Deleted');
        res.redirect('http://localhost:4000/api/v1/users/get')
    } catch (error) {
        console.log(error)
    }


}


///-------------Login ANd Signup



exports.signup = async (req, res) => {
    try {
        res.render('Signup')
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

exports.updatePassword=async(req,res)=>{
    try {
        const{id}=req.params;
        res.render('resetPassword',{
            userid:id
        })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        res.render('Login');
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

///----forgot password link
exports.forgot = async (req, res) => {
    try {
        res.render('forgotPassword')
    } catch (error) {
        console.log(error)
    }
}



exports.forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })
    const resetURL = `localhost:4000/api/v1/users/updateMyPassword/${user._id}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    console.log(message);
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.send('email has been sent')
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.send('There was an error when sendign email please try again leter')
    }
}
exports.resetPassword =async (req, res, next) => {
try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.send('Token is invalid or has expired', 400);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const Token= signToken(user._id);
    res.status(200).json({
        status:'success',
        Token,
    })
} catch (error) {
    console.log(error)
    res.send(error)
}
  
  };