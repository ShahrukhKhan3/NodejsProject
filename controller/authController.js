const User = require('../Modal/UserModal');
const jwt = require('jsonwebtoken');

const signToken = id => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: '39000'
  })
}
exports.signup = (async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  const token = jwt.sign({ id: newUser._id }, 'secret', {
    expiresIn: '360000'
  })
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});



exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  ///----------check if email and password exist

  if (!email || !password) {
    res.send('incorrect Email');
  }
  ///-----------check if user exists and user password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid email or pass'
    })
  }
  const token = signToken(User._id);
  if(!user||!(await user.correctPassword(password, user.password)) ){
      return console.log('Incorrect email or password');
  }
  res.redirect('http://localhost:4000/api/v1/users/get');
  //-------------check if the pasword is correct
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user
  //   }
  // });

};



exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.send('You are not logged in')
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, 'secret');

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.sedn('The user belonging to this token does not exist');
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: 'success',
      message: 'sdfdsf'
    })
  }



  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};



///-------
exports.updatePassword=async (req,res,next)=>{
  try {
    const user=await User.findById(req.params.id).select('+password');
  
  
  
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
      return  res.send('Errorr')
    }
    user.password= req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
   res.redirect('http://localhost:4000/api/v1/users/login')    
  } catch (error) {
    res.send('zxzxzX')
  }

  }