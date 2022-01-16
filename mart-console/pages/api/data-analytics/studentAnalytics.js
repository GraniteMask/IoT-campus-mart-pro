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
                totalExpenditure: {$sum: '$totalPrice'}
            }
        },
        {$sort: {totalExpenditure: -1}}
    ])

    const expenditureByYear = await Order.aggregate([
        {
            $group:{
                _id: '$year',
                totalExpenditure: {$sum: '$totalPrice'}
            }
        },
        {$sort: {totalExpenditure: -1}}
    ])

    const mostPopularCategoryByYear = await Order.aggregate([
        {$match : {}},
        {$unwind : "$orderItems" },
        {$group: {_id: {year: '$year', category: '$orderItems.productCategory'}, totalNumberOfOrder: {$sum: 1}}},
        {$sort: {totalNumberOfOrder: -1}}
    ])

    const mostPopularProductByYear = await Order.aggregate([
        {$match : {}},
        {$unwind : "$orderItems" },
        {$group: {_id: {year: '$year', category: '$orderItems.productName'}, totalNumberOfOrder: {$sum: 1}}},
        {$sort: {totalNumberOfOrder: -1}}
    ])

    await db.disconnect()
    res.send({studentCount, mostActiveStudentYear, mostActiveStudentBlock, eachStudentExpenditure, mostPopularCategoryByYear, mostPopularProductByYear, expenditureByYear})
})

export default handler