const productModel = require('../models/Product')
const createProduct = async (req, res)=>{
    // to save static data in db
    // const product = new productModel({
    //     title:"Pants",
    //     desc:"Best pants in the market place",
    //     price:15,
    //     rating:4,
    //     review:"Best"
    // })
    // to save dynamic data in db
    const product = new productModel({
        title:req.body.title,
        desc:req.body.desc,
        price:req.body.price,
        rating:req.body.rating,
        review:req.body.review,
        productImage:req.body.productImage
    })
    await product.save()
    res.status(201).send("Product created successfully")
}
const getProducts = async (req, res)=>{
    const products = await productModel.find({})
    res.status(200).json(products)
}
const getProduct = async (req, res)=>{
    const id = req.params.id
    const product = await productModel.findById(id)
    res.status(200).send(product)
}

const deleteProduct = async (req, res)=>{
    const id = req.params.id
    const product = await productModel.findByIdAndDelete(id)
    res.status(200).send(`Product with id ${id} has been deleted successfully`)
}
const editProduct = async (req, res)=>{
    const id = req.params.id
    const body = req.body
    const product = await productModel.findByIdAndUpdate(id, body, {new:true})
    res.status(200).send(product)
}
module.exports = {createProduct, getProducts, getProduct, deleteProduct, editProduct}