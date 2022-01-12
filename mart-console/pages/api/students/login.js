import nc from 'next-connect'
import Student from '../../../models/Students'
import { signToken } from '../../../utils/auth'
import db from '../../../utils/db'
import bcrypt from 'bcryptjs'

const handler = nc()

handler.post(async(req, res)=>{
    await db.connect()
    const user = await Student.findOne({email: req.body.email})
    await db.disconnect()
    if(user && bcrypt.compareSync(req.body.password, user.password)){
        const token = signToken(user)
        res.send({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmintoken,
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
    }else{
        res.status(401).send({message: 'Invalid email or password'})
    }
})

export default handler