import nc from 'next-connect'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import Student from '../../../models/Students'
// import { isAuth} from '../../../utils/auth'
import db from '../../../utils/db'


const handler = nc()

// handler.use(isAuth)

handler.get(async(req,res)=>{
    await db.connect()
    const studentCount = await Student.countDocuments()

    const mostActiveStudentYear = await Order.aggregate([
        {
            $group:{
                _id: '$year',
                numberOfOrders: {$sum: 1}
            }
        },
        {$sort: {numberOfOrders: -1}}
    ])

    const mostActiveStudentBlock = await Order.aggregate([
        {
            $group:{
                _id: '$block',
                numberOfOrders: {$sum: 1}
            }
        },
        {$sort: {numberOfOrders: -1}}
    ])

    const eachStudentExpenditure = await Order.aggregate([
        {
            $group:{
                _id: '$name',
                numberOfOrders: {$sum: '$totalPrice'}
            }
        },
        {$sort: {numberOfOrders: -1}}
    ])

    await db.disconnect()
    res.send({studentCount, mostActiveStudentYear, mostActiveStudentBlock, eachStudentExpenditure})
})

export default handler