import nc from 'next-connect'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import Product from '../../../models/Product'

const handler = nc()
handler.use(isAuth)

handler.post(async(req,res)=>{
    try{
        await db.connect()
        // console.log(req.body)
        // console.log(req.body.orderItems.length)

        for(var i=0; i<req.body.orderItems.length; i++){
            // console.log(i)
            var tempBarcodes = new Array()
            for(var j=0; j<req.body.orderItems[i].quantity; j++){
                // console.log(req.body.orderItems[i].productBarcode[j])
                tempBarcodes.push(req.body.orderItems[i].productBarcode[j])    
            }
            req.body.orderItems[i].productBarcode = tempBarcodes
            // console.log(req.body.orderItems[i].productBarcode)
            // console.log(tempBarcodes)
            // console.log(req.body.orderItems[i].productBarcode)
        }
    
        const newOrder = new Order({
            ...req.body,
            studentId: req.user._id,
        })
        
        const order = await newOrder.save()

        if(order){
            for(var i=0; i<req.body.orderItems.length; i++){
                for(var j=0; j<req.body.orderItems[i].productBarcode.length; j++){
                    await Product.findByIdAndUpdate(req.body.orderItems[i]._id,{
                        $pull:{productBarcode: req.body.orderItems[i].productBarcode[j]}
                    })
                }
                
            }
        }
        

        res.status(201).send(order)
    }catch(err){
        console.log(err)
        res.send(err)
    }
    
})

export default handler