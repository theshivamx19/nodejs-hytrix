const productModel = require('../models/productModel')

const products = async (req, res)=>{
    try {
        const data = req.body
        const product = await productModel.create(data)
        return res.status(201).send({status : true, message : "Product created successfully", data : product})
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }

}

module.exports = {products}
