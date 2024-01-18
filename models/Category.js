import mongoose from 'mongoose';
const categoryschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
        trim: true,
        unique:true,
        index:true
    },
    dates : { 
        type: Date, 
        default: Date.now, 
        index: true 
    }},
    {timestamps:true}
)
const Category = mongoose.model("Category", categoryschema)

export default Category;