import React, { useReducer, useRef, useState } from 'react'
import { Button, List, ListItem, TextField, Typography, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, ListItemText, Card, Grid, CircularProgress, CardContent} from '@material-ui/core'
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
    const [{loading, error, productData}, dispatch] = useReducer(reducer, {loading: true, productData:{salesData: []}, error:''}) 
    

    useEffect(()=>{
        try{
            dispatch({type: 'FETCH_REQUEST'})
            const {data} = axios.get('/api/data-analytics/productSales')
            dispatch({type:'FETCH_SUCCESS', payload:data})
        }catch(err){
            dispatch({type:'FETCH_FAIL', payload: err})
        }
        
    },[])


    
    


    

    return (
        <Layout title='Data Analytics Dashboard'>
             <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink  href="/product-analytics" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Product Analytics"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/student-analytics" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Student Analytics"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            {loading ? (<CircularProgress />)
                            :
                            error ? (<Typography className={classes.error}>{error}</Typography>)
                            :
                            (
                                <Grid container spacing={5}>
                                    <Grid item md={4}>
                                        <Card raised>
                                            <CardContent>
                                                <Typography variant="h1">
                                                    ${productData.productsCount}
                                                </Typography>
                                                <Typography>Products online</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
               
           

            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(DataAnalytics),{ssr:false})