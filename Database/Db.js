const mongoose = require('mongoose');
const db = `mongodb://localhost:27017/Mern`;
mongoose.connect(db,{
  
}).then(() => {
  console.log('connected');
}).catch((error) => console.log("not connected"));

module.exports=db;