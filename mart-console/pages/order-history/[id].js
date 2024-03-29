import { Button, Card, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@material-ui/core'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import Layout from '../../Components/Layout'
import { Store } from '../../utils/Store'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import moment from 'moment'


function reducer(state, action){
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true, error:''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error:''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            state
    }
}

function Order({params}) {
    const orderId = params.id
    const classes = useStyles()
    const router = useRouter()
    const {state} = useContext(Store)
    const { userInfo } = state
    const [{loading, order, error}, dispatch] = useReducer(reducer, {loading: true, order:{}, error:''})
    const round2 = num => Math.round(num*100 + Number.EPSILON)/100  //123.456 => 123.46


    const {
        totalPrice,
        orderItems,
        createdAt,
        productBarcode
    } = order

    useEffect(()=>{
        // if(!paymentMethod){
        //     router.push('/payment')
        // }

        const fetchOrder = async () =>{
            try{
                dispatch({type: 'FETCH_REQUEST'})
                const {data} = await axios.get(`/api/orders/${orderId}`,{
                    headers: {authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({type:'FETCH_SUCCESS', payload:data})
            }catch(err){
                dispatch({type:'FETCH_FAIL', payload: err})
            }
        }
        fetchOrder()
    },[])

 

    

    return (
        <Layout title="Place Order">
            {loading ? (<CircularProgress />)
            :
            error ? (<Typography className={classes.error}>{error}</Typography>)
            :
            (<>
                <Typography component="h1" variant="h1">Order Summary</Typography>
           
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
                                    <Typography component="h2" varaint="h2">Ordered Items Details</Typography>
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
                                            {orderItems.map((item)=>(
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
                                        Other Details
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
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography><strong>Ordered On:</strong></Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography><strong>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</strong></Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {loading && (
                                    <ListItem>
                                        <CircularProgress />
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                        <Card className={classes.section}>
                            <List>
                                <ListItem>
                                    <Typography variant="h6">
                                        Barcodes of the product ordered:
                                    </Typography>
                                </ListItem>
                                {
                                    orderItems.map(item =>(
                                        item.productBarcode.map(barcode=>(
                                            // console.log(barcode)
                                            <List key={Math.random()}>
                                                <ListItem><strong>Name: </strong>{item.productName}</ListItem>
                                                <ListItem>
                                                    <strong>Barcode:</strong>{barcode}
                                                </ListItem>
                                            </List>
                                        ))
                                        
                                    ))
                                }
                            </List>
                        </Card>
                    </Grid>
                </Grid>
                </>
            )
            }
            
            
        </Layout>
    )
}

export async function getServerSideProps({params}){
    return {props: {params}}
}

export default dynamic(()=> Promise.resolve(Order),{ssr:false})
