const bcrypt = require('bcrypt');
const crypto=require('crypto')
const { model } = require("mongoose");
const mongoose = require('mongoose');
const userdbsSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
     email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
})
userdbsSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
  
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  })
  
userdbsSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
  
    return await bcrypt.compare(candidatePassword, userPassword);
  }
//   userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//     if (this.passwordChangedAt) {
  
//       const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    
//       return JWTTimestamp < changedTimestamp;
//     }
  
//     // False means NOT changed
//     return false;
//   };

userdbsSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;

  console.log({resetToken},this.passwordResetToken)
};
const Userdbs = model('userdb', userdbsSchema,'Userdbs');
module.exports = Userdbs;
