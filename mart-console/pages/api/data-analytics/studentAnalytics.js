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
})