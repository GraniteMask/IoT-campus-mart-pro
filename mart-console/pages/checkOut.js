import { Button, List, ListItem, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import { Store } from '../utils/Store'
import {useRouter} from 'next/router'
import Cookies from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'

 

export default function Shipping() {
    const {handleSubmit, control, formState: {errors}, setValue, getValues} = useForm()
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const {userInfo, cart:{shippingAddress}} = state;
    const {location} = shippingAddress   //after integrating google maps

    // console.log(userInfo)
    
    useEffect(()=>{
        if(!userInfo){
            router.push('/login?redirect=/shipping')
        }
        setValue('fullName', shippingAddress.fullName)
        setValue('address', shippingAddress.address)
        setValue('city', shippingAddress.city)
        setValue('postalCode', shippingAddress.postalCode)
        setValue('country', shippingAddress.country)
    },[])

    

    // const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')

    const classes = useStyles()

    const submitHandler =  ({fullName, address, city, postalCode, country}) =>{
        // e.preventDefault()

        dispatch({type:"SAVE_SHIPPING_ADDRESS", payload: {fullName, address, city, postalCode, country, location}}) //location is added after google map integration
        Cookies.set('shippingAddress', JSON.stringify({fullName, address, city, postalCode, country, location})) //location is added after google map integration
        router.push('/payment')

       
    }

    const chooseLocationHandler = () => {
        const fullName = getValues('fullName');
        const address = getValues('address');
        const city = getValues('city');
        const postalCode = getValues('postalCode');
        const country = getValues('country');
        dispatch({
          type: 'SAVE_SHIPPING_ADDRESS',
          payload: { fullName, address, city, postalCode, country },
        });
        Cookies.set('shippingAddress', {
          fullName,
          address,
          city,
          postalCode,
          country,
          location,
        });
        router.push('/map');
      };

    return (
        <Layout title="Shipping">
            <CheckOutWizard activeStep={1}/>
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Shipping Address
                </Typography>
                <List>

                    <ListItem>
                        <Controller name="fullName" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="fullName" label="Full Name" inputProps={{type: 'text'}} 
                            error={Boolean(errors.fullName)}
                            helperText ={
                                errors.fullName ? 
                                errors.fullName.type === 'minLength'?
                                'Full Name length must be more than 1 '
                                :'Full Name is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>

                    <ListItem>
                        <Controller name="address" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="address" label="Address" inputProps={{type: 'text'}} 
                            error={Boolean(errors.address)}
                            helperText ={
                                errors.address ? 
                                errors.address.type === 'minLength'?
                                'Address length must be more than 1 '
                                :'Address is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>

                    <ListItem>
                        <Controller name="city" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="city" label="City" inputProps={{type: 'text'}} 
                            error={Boolean(errors.city)}
                            helperText ={
                                errors.city ? 
                                errors.city.type === 'minLength'?
                                'City length must be more than 1 '
                                :'City Name is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>

                    <ListItem>
                        <Controller name="postalCode" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="postalCode" label="Postal Code" inputProps={{type: 'text'}} 
                            error={Boolean(errors.postalCode)}
                            helperText ={
                                errors.postalCode ? 
                                errors.postalCode.type === 'minLength'?
                                'Postal Code length must be more than 1 '
                                :'Postal Code is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>

                    <ListItem>
                        <Controller name="country" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="country" label="Country" inputProps={{type: 'text'}} 
                            error={Boolean(errors.country)}
                            helperText ={
                                errors.country ? 
                                errors.country.type === 'minLength'?
                                'Country length must be more than 1 '
                                :'Country is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>

                    <ListItem>
                        <Button
                        variant="contained"
                        type="button"
                        onClick={chooseLocationHandler}
                        >
                        Choose on map
                        </Button>
                        <Typography>
                        {location.lat && `${location.lat}, ${location.lat}`}
                        </Typography>
                    </ListItem>
                    
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Continue</Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}
