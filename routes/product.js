const express = require('express')
const {createProduct, getProducts, getProduct, deleteProduct, editProduct} = require('../controllers/product')
const router = express.Router()

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.delete('/:id', deleteProduct)
router.patch('/:id', editProduct)

module.exports = router