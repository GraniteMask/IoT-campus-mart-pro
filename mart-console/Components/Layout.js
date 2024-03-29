import React, { useContext, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import {AppBar, Typography, Toolbar, Container, Link, ThemeProvider, CssBaseline,  Badge, Button, Menu, MenuItem, Box} from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import useStyles from '../utils/styles'
import Cookies from 'js-cookie'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'




export default function Layout({title, description, children}) {
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const { cart, userInfo} = state;
    const theme = createTheme({
        typography:{
            h1:{
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            h2:{
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0',
            },
            body1:{
                fontWeight: 'normal',
            },  
        },
        palette:{
            primary:{
                main: '#9966CC',
            },
            secondary:{
                main: "#208080",
            },
        },
        overrides: {
            MuiCssBaseline: {
              "@global": {
                body: {
                    background: "url(https://www.transparenttextures.com/patterns/cartographer.png) repeat" 
                }
              }
            }
          }
    })
    const classes = useStyles();

    const { enqueueSnackbar } = useSnackbar();

    const [query, setQuery] = useState('');
    const queryChangeHandler = (e) => {
        setQuery(e.target.value);
    };

    

    const [anchorEl, setAnchorEl] = useState(null)

    const loginClickHandler = (e) =>{
        setAnchorEl(e.currentTarget)
        // console.log('dsdsd')
    }

    const loginMenuCloseHandler = (e, redirect) =>{
        setAnchorEl(null)
        if(redirect){
            router.push(redirect)
        }
    }

    const logOutClickHandler = () =>{
        setAnchorEl(null)
        dispatch({type:'USER_LOGOUT'})
        Cookies.remove('userInfo')
        Cookies.remove('cartItems')
        Cookies.remove('shippingAddress')
        Cookies.remove('paymentMethod')
        router.push('/')

    }

    
 
    return (
        <div>
            <Head>
                <title>{title? `${title} - Campus Mart Pro`:'Campus Mart Pro'}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" className={classes.navbar}>
                    <Toolbar className={classes.toolbar}>
                        <Box display="flex" alignItems="center">

                        <NextLink href="/" passHref>
                            <Link>
                                <Typography className={classes.brand}>
                                    CAMPUS MART PRO
                                </Typography>
                            </Link>
                        </NextLink>
                        </Box>

                        
                        
                        <div>
                            
                            <NextLink href='/sales-product-analytics'>
                                <Link style={{cursor: "pointer"}}>
                                    Data Analytics
                                </Link>
                            </NextLink>
                            <NextLink href='/cart'>
                                <Link style={{cursor: "pointer"}}>
                                    {cart.cartItems.length > 0 ? <Badge color="secondary" badgeContent={cart.cartItems.length}>Cart</Badge> : ("Cart")}
                                </Link>
                            </NextLink>
                            {userInfo ? (

                            <>
                            <Button className={classes.navbarButton} aria-controls="simple-menu" aria-haspopup="true" onClick={loginClickHandler}>{userInfo.name}</Button>

                            <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={loginMenuCloseHandler}
                            disableBackdropClick
                            >
                            <MenuItem onClick={(e)=>loginMenuCloseHandler(e, '/profile')}>Profile</MenuItem>
                            <MenuItem onClick={(e)=>loginMenuCloseHandler(e, '/order-history')}>Order History</MenuItem>
                            {userInfo.isAdmin && (
                                 <MenuItem onClick={(e)=>loginMenuCloseHandler(e, '/admin/dashboard')}>Admin Dashboard</MenuItem>
                            )}
                            <MenuItem onClick={logOutClickHandler}>Logout</MenuItem>
                            </Menu>
                            </>
                            
                            )
                            :
                            (
                                <NextLink href="/login" passHref>
                                    <Link>Login</Link>
                                </NextLink>
                            )
                        
                            }
                        </div>
                    </Toolbar>
                </AppBar>
                <Container className={classes.main}>
                    {children}
                </Container>
                <footer className={classes.footer}>
                    <Typography>
                        &#169; All rights reserved. 2022 CAMPUS MART PRO
                    </Typography>
                </footer>
            </ThemeProvider>
        </div>
    )
}
