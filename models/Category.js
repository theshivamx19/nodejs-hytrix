import mongoose from 'mongoose'
const categoryschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
        trim: true,
        index:true
    },
    created_at : { 
        type: Date, 
        default: Date.now, 
        index: true 
    },
    updated_at : { 
        type: Date, 
        default: Date.now 
    }
})
const Category = mongoose.model("Category", categoryschema)

export default Category;