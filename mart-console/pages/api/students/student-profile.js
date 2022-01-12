import nc from 'next-connect'
import Student from '../../../models/Students'
import { signToken, isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import bcrypt from 'bcryptjs'

const handler = nc()
handler.use(isAuth)

handler.put(async(req, res)=>{
    await db.connect()
    // console.log(req)
    // console.log(req.user)
    const user = await Student.findById(req.user._id)
    user.block = req.body.block
    user.roomNumber = req.body.roomNumber
    user.year = req.body.year
    user.password = req.body.password ? bcrypt.hashSync(req.body.password) : user.password
    await user.save()
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
    
})

export default handler