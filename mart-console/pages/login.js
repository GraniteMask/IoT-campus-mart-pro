import { Button, List, ListItem, TextField, Typography, Link } from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import axios from 'axios'
import { Store } from '../utils/Store'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import dynamic from 'next/dynamic'
 

function Login() {
    const {handleSubmit, control, formState: {errors}} = useForm()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const {redirect} = router.query
    const {userInfo} = state;

    // console.log(userInfo)
    
    useEffect(()=>{
        if(userInfo){
            router.push('/')
        }
    },[])


    const classes = useStyles()

    const submitHandler = async ({email,password}) =>{
        // e.preventDefault()
        closeSnackbar()
        try{
            const {data} = await axios.post('/api/users/login', {email, password})
            dispatch({type:"USER_LOGIN", payload: data})
            // console.log(data)
            Cookies.set('userInfo', JSON.stringify(data))
            router.push(redirect || '/')
            // alert('success login')
        }catch(err){
            enqueueSnackbar(err.response.data ? err.response.data.message : err.message,
                {
                    variant: 'error'
                })
            // alert(err.response.data ? err.response.data.message : err.message)
        }
        
    }

    return (
        <Layout title="Login">
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <Controller name="email" control={control} defaultValue="" rules={{
                            required: true,
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{type: 'email'}} 
                            error={Boolean(errors.email)}
                            helperText ={
                                errors.email ? 
                                errors.email.type === 'pattern'?
                                'Email is not valid'
                                :'Email is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                        {/* <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{type: 'email'}} onChange={e=> setEmail(e.target.value)}></TextField> */}
                    </ListItem>
                    <ListItem>
                        <Controller name="password" control={control} defaultValue=""  
                            rules={{
                            required: true,
                            minLength: 6,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{type: 'password'}} 
                            error={Boolean(errors.password)}
                            helperText ={
                                errors.password ? 
                                errors.password.type === 'minLength'?
                                'Password length must be longer than 5'
                                :'Password is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                        {/* <TextField variant="outlined" fullWidth id="password" label="password" inputProps={{type: 'password'}} onChange={e=> setPassword(e.target.value)}></TextField> */}
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Login</Button>
                    </ListItem>
                    <ListItem>
                        Don&apos;t have an account ? &nbsp; {' '} <NextLink href={`/signup?redirect=${redirect || '/'}`} passHref><Link>Sign Up</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(Login),{ssr:true})
