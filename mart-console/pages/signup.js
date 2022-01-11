import { Button, List, ListItem, TextField, Typography, Link, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'
import React, { useContext, useEffect, useRef } from 'react'
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
 
function Register() {
    const [openBlock, setOpenBlock] = useState(false);
    const {handleSubmit, control, formState: {errors}} = useForm()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const {redirect} = router.query
    const {userInfo} = state;
    const anchorRefBlock = useRef(null);

    // console.log(userInfo)

    useEffect(()=>{
        if(userInfo){
            router.push('/')
        }
    },[])

    const handleToggleBlock = () => {
        setOpenBlock((prevOpen) => !prevOpen);
    };

    const handleCloseService = (event) => {
        if (anchorRefService.current && anchorRefService.current.contains(event.target)) {
            return;
        }

        setOpenService(false);
    };
    
   

    

    // const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [confirmPassword, setConfirmPassword] = useState('')

    const classes = useStyles()

    const submitHandler = async ({name, email, password, confirmPassword}) =>{
        // e.preventDefault()
        closeSnackbar()
        if(password !== confirmPassword){
            // alert("Password don't matched")
            enqueueSnackbar("Password and Confirm Password don't matched", {variant: 'error'})
            return
        }

        try{
            const {data} = await axios.post('/api/users/register', {name, email, password})
            dispatch({type:"USER_LOGIN", payload: data})
            // console.log(data)
            Cookies.set('userInfo', JSON.stringify(data))
            router.push(redirect || '/')
            // alert('success login')
        }catch(err){
            enqueueSnackbar(err.response.data ? err.response.data.message : err.message, {variant: 'error'})
            // alert(err.response.data ? err.response.data.message : err.message)
        }
        
    }

    return (
        <Layout title="Register">
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Register for students
                </Typography>
                <List>
                    <ListItem>
                        <Controller name="name" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="name" label="Name" inputProps={{type: 'name'}} 
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
                            <TextField variant="outlined" fullWidth id="email" label="Official Email" inputProps={{type: 'email'}} 
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
                    </ListItem>
                    <ListItem>
                        <Controller name="confirmPassword" control={control} defaultValue=""  
                            rules={{
                            required: true,
                            minLength: 6,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}} 
                            error={Boolean(errors.confirmPassword)}
                            helperText ={
                                errors.confirmPassword ? 
                                errors.confirmPassword.type === 'minLength'?
                                'Confirm Password length must be longer than 5'
                                :'Confirm Password is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Button
                            ref={anchorRefBlock}
                            aria-controls={openService ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggleService}
                            style={{ color: "yellow", textTransform: "none", opacity: "0.8"}}
                            className="organize_number_of_people search_navbar_button_color_white"
                        >
                            Select your block<ExpandMoreIcon style={{marginLeft: "1rem"}}/>
                        </Button>
                        <Popper style={{ zIndex: 999999 }} open={openService} anchorEl={anchorRefService.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseService}>
                                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDownService}>
                                                <MenuItem onClick={()=>handleExplore('foodBox')}>Redingle FoodBox</MenuItem>
                                                <MenuItem onClick={()=>handleExplore('homeBuffet')}>Redingle Home Buffet</MenuItem>
                                                <MenuItem onClick={()=>handleExplore('grandBuffet')}>Redingle Grand Buffet</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </ListItem>
                    {/* <ListItem>
                        <TextField variant="outlined" fullWidth id="confirmPassword" label="Confirm Password" inputProps={{type: 'password'}} onChange={e=> setConfirmPassword(e.target.value)}></TextField>
                    </ListItem> */}
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">Register</Button>
                    </ListItem>
                    <ListItem>
                        Already have an account ? &nbsp; {' '} <NextLink href={`/login?redirect=${redirect || '/'}`} passHref><Link>Login</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}

export default dynamic(()=> Promise.resolve(Register),{ssr:true})