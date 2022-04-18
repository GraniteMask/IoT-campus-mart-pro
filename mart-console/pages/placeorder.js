import { Button, Card, Grid, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useRouter } from 'next/router'
import useStyles from '../utils/styles'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'

function PlaceOrder() {
    const classes = useStyles()
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const { userInfo, cart: {cartItems} } = state

    const round2 = num => Math.round(num*100 + Number.EPSILON)/100  //123.456 => 123.46
    const itemsPrice = round2(cartItems.reduce((a,c) => a + c.productPrice*c.quantity, 0))
    // const taxPrice = round2(itemsPrice*0.15)
    const totalPrice = round2(itemsPrice)

    useEffect(()=>{
        if(!userInfo){
            router.push('/login')
        }
        if(cartItems.length === 0){
            router.push('/cart')
        }
    },[])

    const {closeSnackbar, enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)

    const placeOrderHandler = async () =>{
        closeSnackbar()
        try{
            // setLoading(true)
            // console.log('sdsds')
            const {data} = await axios.post('/api/orders',{
                orderItems: cartItems,
                name: userInfo.name,
                registrationNumber: userInfo.registrationNumber,
                course: userInfo.course,
                year: userInfo.year,
                email: userInfo.email,
                roomNumber: userInfo.roomNumber,
                block: userInfo.block,
                qrId: userInfo.qrId,
                totalPrice
            },{
                headers:{
                    authorization: `Bearer ${userInfo.token}`
                },
            })
            dispatch({type: 'CART_CLEAR'}) 
            Cookies.remove('cartItems')
            setLoading(false)
            router.push(`/order-history/${data._id}`)
        }catch(err){
            // setLoading(false)
            enqueueSnackbar(err, {variant: 'error'})
        }
    }

    return (
        <Layout title="Place Order">
            <Typography component="h1" variant="h1">Place Order</Typography>
           
                <Grid container spacing={1}>
                    <Grid item md={9} xs={12}>

                        <Card className={classes.section}>
                        <List>
                                    <ListItem>
                                        <Typography component="h2" variant="h2">Student Information</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <strong>Name:</strong> &nbsp;{userInfo.name}
                                    </ListItem>
                                    <ListItem>
                                        <strong>Registration Number:</strong> &nbsp;{userInfo.registrationNumber}
                                    </ListItem>
                                    <ListItem>
                                        <strong>Stream:</strong> &nbsp;{
                                        
                                        userInfo.course == 'btechElectricalAndElectronics' ? 'BTech. Electrical and Electronics Engineering'
                                        :
                                        userInfo.course == 'btechComputer' ? 'BTech. Computer Science Engineering'
                                        :
                                        userInfo.course == 'btechMechanical' ? 'BTech. Mechanical Engineering'
                                        :
                                        userInfo.course == 'btechECE' ? 'BTech. Electronics and Communication Engineering'
                                        :
                                        userInfo.course == 'btechElectronicsComputer' ? 'BTech. Electronics and Computer Science Engineering'
                                        :
                                        userInfo.course == 'btechCivil' ? 'BTech. Civil Engineering'
                                        :
                                        userInfo.course == 'btechComputerAI' ? 'BTech. Computer Science and Artificial Intelligence Engineering'
                                        : 
                                        userInfo.course == 'btechComputerCyber' ? 'BTech. Computer Science and Cyber Security Engineering'
                                        :
                                        userInfo.course
                                        }
                                    </ListItem>
                                    <ListItem>
                                        <strong>Year of Study:</strong> &nbsp;{userInfo.year == 'first' ? 'First' : userInfo.year == 'second' ? 'Second' : userInfo.year == 'third' ? 'Third' : userInfo.year == 'fourth' ? 'Fourth' : userInfo.year == 'fifth' ? 'Fifth' : userInfo.year == 'sixth' ? 'Sixth' : userInfo.year} Year
                                    </ListItem>
                                    <ListItem>
                                        <strong>Email:</strong>&nbsp; {userInfo.email}
                                    </ListItem>
                                    <ListItem>
                                        <strong>Room Number:</strong>&nbsp; {userInfo.roomNumber}
                                    </ListItem>
                                    <ListItem>
                                        <strong>Block:</strong>&nbsp; {userInfo.block == 'blockA' ? ' Block A' : userInfo.block == 'blockB' ? ' Block B' : userInfo.block == 'blockC' ? ' Block C' : userInfo.block}
                                    </ListItem>
                                </List>
                        </Card>

                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography component="h2" varaint="h2">Order Items</Typography>
                                </ListItem>
                                <ListItem>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                
                                                <TableCell>Name</TableCell>
                                                <TableCell>Manufacturer</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {cartItems.map((item)=>(
                                                <TableRow key={item._id}>

                                                    {/* <TableCell>
                                                        <NextLink href={`/product/${item.slug}`} passHref>
                                                            <Link>
                                                                <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                            </Link>
                                                        </NextLink>
                                                    </TableCell> */}

                                                    <TableCell>
                                                        {/* <NextLink href={`/product/${item.slug}`} passHref>
                                                            <Link> */}
                                                                <Typography>{item.productName}</Typography>
                                                            {/* </Link>
                                                        </NextLink> */}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{item.productCompany}</Typography>                                                    
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{item.productCategory}</Typography>                                                    
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <Typography>{item.quantity}</Typography>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <Typography>Rs. {item.productPrice}</Typography>
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                </TableContainer> 
                                </ListItem>
                            </List>
 
                        </Card>
                       
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">
                                       Place your Order
                                    </Typography>
                                </ListItem>
                                
                               
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography><strong>Total:</strong></Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography><strong>Rs.{totalPrice}</strong></Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <ListItem>
                                    <Button onClick={placeOrderHandler} variant="contained" color="primary" fullWidth>Confirm Order</Button>
                                </ListItem>
                                {loading && (
                                    <ListItem>
                                        <CircularProgress />
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(PlaceOrder),{ssr:false})
