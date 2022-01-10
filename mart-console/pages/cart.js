import { Button, Card, Grid, Link, List, ListItem, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useRouter } from 'next/router'

function CartScreen() {
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const { cart: {cartItems} } = state

    const updateCartHandler = async(item,quantity) =>{

        if(item.productBarcode.length < quantity){
            window.alert('Oops!! Product is out of stock.')
            return
        }
        dispatch({type: 'CART_ADD_ITEM', payload: {...item, quantity}})
    }

    const removeItemHandler = (item) =>{
        dispatch({type:'CART_REMOVE_ITEM', payload: item})
    }

    const checkoutHandler = () =>{
        router.push('/shipping')
    }

    return (
        <Layout title="Shopping Cart">
            <Typography component="h1" variant="h1">Shopping Cart</Typography>
            {cartItems.length === 0 ? (<div>
                Cart is Empty. <NextLink href="/" passHref><Link>ADD ITEMS</Link></NextLink>
            </div>) :
            (
                <Grid container spacing={1}>
                    <Grid item md={8} xs={12}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {cartItems.map((item)=>(
                                        <TableRow key={item._id}>

                                            <TableCell>
                                                <NextLink href={`/`} passHref>
                                                    <Link>
                                                        <Typography>{item.productName}</Typography>
                                                    </Link>
                                                </NextLink>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Select value={item.quantity} onChange={(e)=>updateCartHandler(item, e.target.value)}>
                                                    {[...Array(item.productBarcode.length).keys()].map((x)=>(
                                                        <MenuItem key={x+1} value={x+1}>{x+1}</MenuItem>))}
                                                </Select>
                                            </TableCell>

                                            <TableCell align="right">
                                                Rs. {item.productPrice}
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button variant="contained" color="secondary" onClick={()=>removeItemHandler(item)}>Delete</Button>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card style={{ background: 'rgba(0, 0, 0, 0.1) no-repeat scroll 16px 16px'}}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">
                                        Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} {' '} items) : Rs. {cartItems.reduce((a, c) => a + c.quantity * c.productPrice, 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" color="primary" fullWidth onClick={checkoutHandler}>Check Out</Button>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(CartScreen),{ssr:false})
