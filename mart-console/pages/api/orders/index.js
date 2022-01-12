import nc from 'next-connect'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'

handler.use(isAuth)

handler.post(async(req,res)=>{
    await db.connect()
    const newOrder = new Order({
        ...req.body,
        student: req.user._id,
    })
    const order = await newOrder.save()
    res.status(201).send(order)
})

export default handler