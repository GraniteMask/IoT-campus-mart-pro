import nc from 'next-connect'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import Product from '../../../models/Product'

const handler = nc()
handler.use(isAuth)

handler.post(async(req,res)=>{
    await db.connect()
    // console.log(req.body)
    // console.log(req.body.orderItems.length)

    for(var i=0; i<req.body.orderItems.length; i++){
        console.log(i)
        var tempBarcodes = new Array()
        for(var j=0; j<req.body.orderItems[i].quantity; j++){
            // console.log(req.body.orderItems[i].productBarcode[j])
            tempBarcodes.push(req.body.orderItems[i].productBarcode[j])    
        }
        for( var b=0; b<req.body.orderItems[i].productBarcode; b++){

        }
        console.log(tempBarcodes)
    }
  
    // const newOrder = new Order({
    //     ...req.body,
    //     studentId: req.user._id,
    // })

    // for(var i=0; i<req.body.orderItems.length; i++){
    //     for(var j=0; j<req.body.orderItems.productBarcode; j++){
    //         if(j<req.body.orderItems.quantity){
    //             delete req.body.orderItems[i].productBarcode[j]
    //         }
    //     }
    // }

    // const order = await newOrder.save()

    

    res.status(201).send(order)
})

export default handler