import React from 'react'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { Store } from '../../utils/Store'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useReducer } from 'react'
import axios from 'axios'
import Layout from '../../components/Layout'
import { Button, Card, CircularProgress, Grid, ListItem, ListItemText, TableBody, TableCell, TableContainer, Typography, List, Table, TableHead, TableRow } from '@material-ui/core'
import useStyles from '../../utils/styles'
import NextLink from 'next/link'
import moment from 'moment'

function reducer(state, action){
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true, error:''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload, error:''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}

        default:
            state
    }
}

function OrderHistory() {
    const {state} = useContext(Store)
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()

    const [{loading, error, orders}, dispatch] = useReducer(reducer, {loading: true, orders:[], error:''})

    useEffect(()=>{
        if(!userInfo){
            router.push('/login')
        }
        const fetchOrders = async () =>{
            try{
                dispatch({type: 'FETCH_REQUEST'})
                const {data} = await axios.get(`/api/orders/history`,{
                    headers: {authorization: `Bearer ${userInfo.token}`}
                })
                dispatch({type:'FETCH_SUCCESS', payload:data})
            }catch(err){
                dispatch({type:'FETCH_FAIL', payload:getError(err)})
            }
        }
        fetchOrders()
    }, [])
    return (
        <Layout title='Your Order History'>
             <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/profile" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="User Profile"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/order-history" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Order History"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Order History
                                </Typography>
                            </ListItem>
                            <ListItem>
                            {loading ? (<CircularProgress />)
                            :
                            error ? (<Typography className={classes.error}>{error}</Typography>)
                            :(
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>ORDERED ON</TableCell>
                                                <TableCell>TOTAL</TableCell>
                                                {/* <TableCell>DELIVERED</TableCell> */}
                                                <TableCell>ACTION</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order)=>(
                                                <TableRow key={order._id}>
                                                    <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                    <TableCell>{moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                                                    <TableCell>Rs.{order.totalPrice}</TableCell>
                                                    {/* <TableCell>{order.iDelivered ?
                                                    `delivered at ${order.deliveredAt}` :
                                                    'not delivered'}</TableCell> */}
                                                    <TableCell>
                                                        <NextLink href={`/order-history/${order._id}`} passHref>
                                                            <Button variant="contained">Details</Button>
                                                        </NextLink>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
               
           

            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(OrderHistory),{ssr:false})