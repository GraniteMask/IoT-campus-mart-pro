import nc from 'next-connect'
import Student from '../../../models/Students'
import { signToken } from '../../../utils/auth'
import db from '../../../utils/db'
import bcrypt from 'bcryptjs'

const handler = nc()

handler.post(async(req, res)=>{
    await db.connect()
    const newUser = new Student({
        name: req.body.name, 
        email: req.body.email, 
        password: bcrypt.hashSync(req.body.password), 
        registrationNumber: req.body.registrationNumber, 
        roomNumber: req.body.roomNumber, 
        block: req.body.block,
        course: req.body.course,
        year: req.body.year,
    })
    const user = await newUser.save()
    await db.disconnect()
    
    const token = signToken(user)
    res.send({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        roomNumber: user.roomNumber,
        block: user.block,
        course: user.course,
        year: user.year
    })
    
})

export default handler