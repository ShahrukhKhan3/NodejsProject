const express = require('express');
const db=require('./Database/Db')
const app = express()
var bodyParser = require('body-parser');
const port = 4000
const userRouter = require('./Routes/userRoute');
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json())
app.use('/api/v1/users', userRouter);

app.listen(port, () => {
 console.log(`Example app listening at http://localhost:${port}`)
})
