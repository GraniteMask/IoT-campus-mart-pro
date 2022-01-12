import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    studentId:{type: mongoose.Schema.Types.ObjectId, ref:'Student' ,required: true},
    name:{type: String, required: true},
    registrationNumber:{type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    roomNumber:{type: String, required: true},
    block:{type: String, required: true},
    course:{type: String, required: true},
    year:{type: String, required: true},
    qrId:{type: String, required: true},
    quantity: {type: Number, required: true},
    barcodes: {type: Array, required: true}
},{
    timestamps: true
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order