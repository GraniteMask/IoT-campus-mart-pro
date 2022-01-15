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
    const ordersCount = await Order.countDocuments()
    const productsCount = await Product.countDocuments()
    const userCount = await Student.countDocuments()
    const ordersPriceGroup = await Order.aggregate([
        {
            $group:{
                _id: null,
                sales: {$sum: '$totalPrice'}
            }
        }
    ])
    const ordersPrice = ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: {$dateToString: {format: '%Y-%m', date: '$createdAt'}},
                totalSales: {$sum: '$totalPrice'},
            },
        },
    ]);

    const ordersInMonth = await Order.aggregate([
        
        {
            $group: {
                _id: {$dateToString: {format: '%Y-%m', date: '$createdAt'}},
                totalNumbers: {$sum: 1},
            },
        },
    ]);

    const ordersDaily = await Order.aggregate([
        
        {
            $group: {
                _id: {$dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
                totalNumbers: {$sum: '$totalPrice'},
            },
        },
        {$sort: {"_id": 1}}
    ]);

    // const individualProducts = await Order.aggregate([
    //     {$match: {'orderItems.productName': 'product 2'}},
    //     {
    //         $project: {
    //             orderItems:{
    //                 $filter:{
    //                     input: '$orderItems',
    //                     as: 'orderItem',
    //                     cond: {$eq: ['$$orderItem.productName', 'product 2']}
    //                 }
    //             }
    //         }
    //     }
    // ])
    // for(var i=0; i<individualProducts.length; i++){
    //     for(var j=0; j<individualProducts[i].orderItems.length; j++){
    //         console.log(individualProducts[i].orderItems[j].productPrice * individualProducts[i].orderItems[j].quantity)
    //     }
    // }


    const mostPopularProducts = await Order.aggregate([
        {$match : {}},
        {$unwind : "$orderItems" },
        {$group: {_id: '$orderItems.productName', totalNumberOfQtyOrder: {$sum: '$orderItems.quantity'}}},
        {$sort: {totalNumberOfQtyOrder: -1}}
    ])

    const mostPopularCategory = await Order.aggregate([
        {$match : {}},
        {$unwind : "$orderItems" },
        {$group: {_id: '$orderItems.productCategory', totalNumberOfOrder: {$sum: 1}}},
        {$sort: {totalNumberOfOrder: -1}}
    ])

    // const allItems2 = await Order.aggregate([
    //     {$match : {}},
    //     {$unwind : "$orderItems" },
    //     {$group: {_id: '$orderItems.productName', totalNumberOfOrdersInWhichThisIsPresent: {$sum: 1}}}
    // ])

    const totalSalesOfEachItem = await Order.aggregate([
        {$match : {}},
        {$unwind : "$orderItems" },
        {$group: {_id: '$orderItems.productName', totalSalesofItem: {$sum: {$multiply: [{ $toInt: '$orderItems.quantity' },{ $toInt: '$orderItems.productPrice' }]}}}},
        {$sort: {totalSalesofItem: -1}}
    ])


    // for(var a=0; a<allItems.length; a++){
    //     const individualProducts = await Order.aggregate([
    //         {$match: {'orderItems.productName': allItems[a]._id}},
    //         {
    //             $project: {
    //                 orderItems:{
    //                     $filter:{
    //                         input: '$orderItems',
    //                         as: 'orderItem',
    //                         cond: {$eq: ['$$orderItem.productName', allItems[a]._id]}
    //                     }
    //                 }
    //             }
    //         }
    //     ])
    //     for(var i=0; i<individualProducts.length; i++){
    //         for(var j=0; j<individualProducts[i].orderItems.length; j++){
    //             console.log(individualProducts[i].orderItems[j].productPrice * individualProducts[i].orderItems[j].quantity)
    //         }
    //     }
    // }

    await db.disconnect()
    res.send({ordersCount, productsCount, userCount, ordersPrice, salesData, mostPopularProducts, totalSalesOfEachItem, ordersInMonth, mostPopularCategory, ordersDaily})
})

export default handler


//use radar chart to determine popularity of product group with year of student