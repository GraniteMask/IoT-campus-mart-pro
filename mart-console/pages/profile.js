import React from 'react'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Layout from '../components/Layout'
import { Button, Card,  Grid, ListItem, ListItemText, Typography, List,  TextField } from '@material-ui/core'
import useStyles from '../utils/styles'
import NextLink from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'

function Profile() {
    const {state, dispatch} = useContext(Store)
    const {handleSubmit, control, formState: {errors}, setValue} = useForm()
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()


    useEffect(()=>{
        if(!userInfo){
            return router.push('/login')
        }

        setValue('name', userInfo.name)
        setValue('email', userInfo.email)
    }, [])

    
console.log(userInfo)
    const submitHandler = async ({name, email, password, confirmPassword}) =>{
        // e.preventDefault()
        closeSnackbar()
        if(password !== confirmPassword){
            // alert("Password don't matched")
            enqueueSnackbar("Password and Confirm Password don't matched", {variant: 'error'})
            return
        }

        try{
            const {data} = await axios.put('/api/users/profile', {name, email, password},{
                headers: 
                {authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({type:"USER_LOGIN", payload: data})
            // console.log(data)
            Cookies.set('userInfo', JSON.stringify(data))
            enqueueSnackbar("Profile updated successfully", {variant: 'success'})
        }catch(err){
            enqueueSnackbar(err.response.data ? err.response.data.message : err.message, {variant: 'error'})
            // alert(err.response.data ? err.response.data.message : err.message)
        }
        
    }

    return (
        <Layout title='Profile'>
             <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink  href="/profile" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="User Profile"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/order-history" passHref>
                                <ListItem button component="a">
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
                                    Profile
                                </Typography>
                            </ListItem>
                            <ListItem>
                            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                                <List>
                                    <ListItem>
                                        <Typography variant="h6">Your Unique QR code. Use it for scanning while receiving your order:</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${userInfo.qrId}&amp;size=300x300`} alt="" title="" />
                                    </ListItem>
                                    <ListItem>
                                        <Controller name="name" control={control} defaultValue="" rules={{
                                            required: true,
                                            minLength: 2,
                                        }} render={({field})=>(
                                            <TextField variant="outlined" fullWidth id="name" label="Name" inputProps={{type: 'name'}} disabled
                                            error={Boolean(errors.name)}
                                            helperText ={
                                                errors.name ? 
                                                errors.name.type === 'minLength'?
                                                'Name length must be more than 1 '
                                                :'Name is required'
                                                :''}
                                            {...field}></TextField>
                                        )}>

                                        </Controller>
                                    </ListItem>
                                    <ListItem>
                                        <Controller name="email" control={control} defaultValue="" rules={{
                                            required: true,
                                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                        }} render={({field})=>(
                                            <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{type: 'email'}} disabled
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
                                    </ListItem>
                                    <ListItem>
                                        <Controller name="password" control={control} defaultValue=""  
                                            rules={{ 
                                                validate: (value) => (value === '' || value.length > 5 || "Password length should be more than 5")
                                        }} render={({field})=>(
                                            <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{type: 'password'}} 
                                            error={Boolean(errors.password)}
                                            helperText ={
                                                errors.password ? 
                                                'Password length must be longer than 5'
                                                :''}
                                            {...field}></TextField>
                                        )}>

                                        </Controller>
                                    </ListItem>
                                    <ListItem>
                                        <Controller name="confirmPassword" control={control} defaultValue=""  
                                             rules={{ 
                                                validate: (value) => (value === '' || value.length > 5 || "Confirm Password length should be more than 5")
                                        }} render={({field})=>(
                                            <TextField variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}} 
                                            error={Boolean(errors.confirmPassword)}
                                            helperText ={
                                                errors.password ? 
                                                'Confirm Password length must be longer than 5'
                                                :''}
                                            {...field}></TextField>
                                        )}>

                                        </Controller>
                                    </ListItem>
                                    {/* <ListItem>
                                        <TextField variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}} onChange={e=> setConfirmPassword(e.target.value)}></TextField>
                                    </ListItem> */}
                                    <ListItem>
                                        <Button variant="contained" type="submit" fullWidth color="primary">Update</Button>
                                    </ListItem>

                                    
                                </List>
                            </form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
               
           

            
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(Profile),{ssr:false})