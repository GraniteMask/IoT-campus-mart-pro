import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productName:{type: String, required: true},
    productBarcode: {type: Array, required: true},
    manufacturingDate: {type: String, required: true},
    productCategory: {type: String, required: true},
    productPrice: {type: String, required: true},
})

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product