import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://Admin:Admin123@cluster0.ngpjs.mongodb.net/projectDb", {
    useNewUrlParser : true,
    useUnifiedTopology: true,
})
.then(()=> console.log("MongoDb connected successfully"))
.catch(err => console.log(err.message))
