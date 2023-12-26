const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currencyId: {
        type: String,
        enum: ['INR'],
        required: true
    },
    currencyFormat: {
        type: String,
        enum: ["₹"],
        required: true
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    // productImage: { string, mandatory },  // s3 link
    // style: {
    //     type: String,
    //     required: true,
    // },
    availableSizes: {
        type: String,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
        required: true
    },
    installments: {
        type: Number,
        required: true
    },
    // deletedAt: {
    //     type: new Date()
    // },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })