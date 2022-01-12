import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    student:{type: mongoose.Schema.Types.ObjectId, ref:'Student' ,required: true},
    
},{
    timestamps: true
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order