import React, { useReducer, useRef, useState } from 'react'
import { Button, List, ListItem, TextField, Typography, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, ListItemText, Card, Grid, CircularProgress, CardContent, CardActions} from '@material-ui/core'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Bar, Pie } from 'react-chartjs-2';





function reducer(state, action){
    switch(action.type){
        case "FETCH_REQUEST":
            return {...state, loading: true, error:''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, productData: action.payload, error:''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}

        default:
            state
    }
}

function DataAnalytics() {

    const classes = useStyles()
    const [{loading, error, productData}, dispatch] = useReducer(reducer, {loading: true, productData:{salesData:[], ordersInMonth: [], mostPopularProducts: []}, error:''}) 
    

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                dispatch({type: 'FETCH_REQUEST'})
                const {data} = await axios.get('/api/data-analytics/productSales')
                // console.log(data)
                dispatch({type:'FETCH_SUCCESS', payload:data})
            }catch(err){
                console.log(err)
                // dispatch({type:'FETCH_FAIL', payload: err})
            }
        }
        fetchData()
       
        
    },[])


    //  console.log(productData.salesData.map((x)=> x._id))

    // var usedColor = ['#9966CC']
    
    // function getRandomColor() {
    //     var letters = '0123456789ABCDEF'.split('');
    //     var color = '#';
    //     for (var i = 0; i < 6; i++ ) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }       
    //     for(var j=0; j<usedColor.length; j++){
    //         if(usedColor !== color){
    //             usedColor.push(color)
    //             return color;
    //         }
    //     }
    // }

    // var fillcolor = getRandomColor()
    // console.log(fillcolor)
    

    return (
        <Layout title='Data Analytics Dashboard'>
             <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink  href="/sales-product-analytics" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Sales &amp; Product Analytics"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/student-analytics" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Student Analytics"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/allOrders" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="All Orders"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography variant="h1">Sales &amp; Product Analytics</Typography>
                            </ListItem>
                            <ListItem>
                            {loading ? (<CircularProgress />)
                            :
                            error ? (<Typography className={classes.error}>{error}</Typography>)
                            :
                            (
                                <Grid container spacing={5}>
                                    <Grid item md={4}>
                                        <Card raised style={{background: 'rgba(0, 0, 0, 0.1) no-repeat scroll 16px 16px'}}>
                                            <CardContent >
                                                <Typography variant="h1" color= "primary">
                                                    Rs.{productData.ordersPrice}
                                                </Typography>
                                                <Typography>TOTAL SALES (all-time)</Typography>
                                            </CardContent>
                                            
                                        </Card>
                                    </Grid>
                                    <Grid item md={4}>
                                        <Card raised style={{background: 'rgba(0, 0, 0, 0.1) no-repeat scroll 16px 16px'}}>
                                            <CardContent >
                                                <Typography variant="h1" color= "primary">
                                                    {productData.productsCount}
                                                </Typography>
                                                <Typography>PRODUCTS ONLINE</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item md={4}>
                                        <Card raised style={{background: 'rgba(0, 0, 0, 0.1) no-repeat scroll 16px 16px'}}>
                                            <CardContent>
                                                <Typography variant="h1" color= "primary">
                                                    {productData.ordersCount}
                                                </Typography>
                                                <Typography>TOTAL ORDERS (all-time) </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                            </ListItem>
                            <ListItem>
                                <Typography variant="h2">
                                    Dashboard:
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Pie data={{labels: productData.mostPopularProducts.map((x)=> x._id),
                                    datasets: [
                                        {
                                            label: 'Most Popular Products',
                                            backgroundColor: ['#00008B', '#0a2351','#002D62', '#00308F',  '#0039a6','#0000FF', '#007FFF', '#2a52be', '#318CE7', '#1F75FE' ],
                                            data: productData.mostPopularProducts.map((x)=>x.totalNumberOfQtyOrder)
                                        }
                                    ]}}
                                    options={{
                                        legend: {display: true, position: 'top'},
                                        title: {
                                            display: true,
                                            text: 'Most Popular Products with respective quantity ordered',
                                            fontSize: 15
                                        },
                                    }}
                                >
                                </Pie>
                            </ListItem>
                            <ListItem>
                                <Bar data={{labels: productData.salesData.map((x)=> x._id),
                                datasets: [
                                    {
                                        label: 'Sales',
                                        backgroundColor: '#9966CC',
                                        data: productData.salesData.map((x)=>x.totalSales)
                                    }
                                ]}}
                                options={{
                                    legend: {display: true, position: 'top'},
                                    title: {
                                        display: true,
                                        text: 'Sales of products in each month',
                                        fontSize: 15
                                    },
                                    // scales: {
                                    //     yAxes: [{
                                    //         ticks: {
                                    //             beginAtZero: true
                                    //         }
                                    //     }]
                                    // }
                                }}
                                >
                                </Bar>
                            </ListItem>
                            <ListItem>
                                <Bar data={{labels: productData.ordersInMonth.map((x)=> x._id),
                                    datasets: [
                                        {
                                            label: 'Sales',
                                            backgroundColor: '#6CB4EE',
                                            data: productData.ordersInMonth.map((x)=>x.totalNumbers)
                                        }
                                    ]}}
                                    options={{
                                        legend: {display: true, position: 'top'},
                                        title: {
                                            display: true,
                                            text: 'Total Orders in each month',
                                            fontSize: 15
                                        },
                                    }}
                                >
                                </Bar>
                            </ListItem>
                            
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
               
           

            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(DataAnalytics),{ssr:false})

//npm i react-chartjs-2@2.10.0 chart.js@2.9.4