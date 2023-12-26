const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route')
const app = express()

app.use(express.json())
mongoose.connect('mongodb+srv://Admin:Admin123@cluster0.ngpjs.mongodb.net/product_managment_hytrix', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDb connected successfully '))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(3000, () => {
    console.log('Express app listening on port ' + 3000)
})