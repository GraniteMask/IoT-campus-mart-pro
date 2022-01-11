import nc from 'next-connect'
import Student from '../../../models/Students'
import { signToken } from '../../../utils/auth'
import db from '../../../utils/db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';

const handler = nc()

handler.post(async(req, res)=>{
    try{
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
            qrId: uuidv4()
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
            year: user.year,
            qrId: user.qrId
        })
    }catch(err){
        console.log(err)
    }
    
    
})

export default handler