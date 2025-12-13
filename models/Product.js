const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    title:String,
    desc:String,
    price:Number,
    rating:Number,
    review:String,
    productImage:String
})

const productModel = mongoose.model('product', productSchema)
module.exports = productModel