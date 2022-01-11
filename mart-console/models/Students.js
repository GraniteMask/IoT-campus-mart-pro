import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    name:{type: String, required: true},
    registrationNumber:{type: String, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    roomNumber:{type: String, required: true},
    block:{type: String, required: true},
    course:{type: String, required: true},
    year:{type: String, required: true},
    qrId:{type: String, required: true},
})

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema)

export default Student