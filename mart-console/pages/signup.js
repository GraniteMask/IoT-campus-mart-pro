import { Button, List, ListItem, TextField, Typography, Link, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { uuid } from 'uuidv4';
 
function Register() {
    const [openBlock, setOpenBlock] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);
    const [qrId, SetQrId] = useState('')
    const [block, setBlock] = useState('')
    const [year, setYear] = useState('')
    const [course, setCourse] = useState('')
    const {handleSubmit, control, formState: {errors}} = useForm()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const router = useRouter()
    const {state, dispatch} = useContext(Store)
    const {redirect} = router.query
    const {userInfo} = state;
    const anchorRefBlock = useRef(null);
    const anchorRefYear = useRef(null);
    const anchorRefCourse = useRef(null);
    const prevOpenBlock = useRef(openBlock);
    const prevOpenYear = useRef(openYear);
    const prevOpenCourse = useRef(openCourse);
    const classes = useStyles()

    // console.log(userInfo)

    useEffect(()=>{
        if(userInfo){
            router.push('/')
        }    
    },[])


    const handleToggleBlock = () => {
        setOpenBlock((prevOpenBlock) => !prevOpenBlock);
    };
    const handleToggleYear = () => {
        setOpenYear((prevOpenYear) => !prevOpenYear);
    };
    const handleToggleCourse = () => {
        setOpenCourse((prevOpenCourse) => !prevOpenCourse);
    };

    const handleCloseBlock = (event) => {
        if (anchorRefBlock.current && anchorRefBlock.current.contains(event.target)) {
            return;
        }

        setOpenBlock(false);
    };
    const handleCloseYear = (event) => {
        if (anchorRefYear.current && anchorRefYear.current.contains(event.target)) {
            return;
        }

        setOpenYear(false);
    };
    const handleCloseCourse = (event) => {
        if (anchorRefCourse.current && anchorRefCourse.current.contains(event.target)) {
            return;
        }

        setOpenCourse(false);
    };
    
    function handleListKeyDownBlock(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenBlock(false);
        }
    }
    function handleListKeyDownYear(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenBlock(false);
        }
    }
    function handleListKeyDownCourse(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenCourse(false);
        }
    }

    const handleBlock = (e) =>{
        setBlock(e)
        setOpenBlock(false);
    }
    const handleYear = (e) =>{
        setYear(e)
        setOpenYear(false);
    }
    const handleCourse = (e) =>{
        setCourse(e)
        setOpenCourse(false);
    }


    

    const submitHandler = async ({name, email, password, confirmPassword, registrationNumber, roomNumber}) =>{
        // e.preventDefault()
        closeSnackbar()
        if(password !== confirmPassword){
            // alert("Password don't matched")
            enqueueSnackbar("Password and Confirm Password don't matched", {variant: 'error'})
            return
        }

        if(block == ''){
            enqueueSnackbar("Select your Block", {variant: 'error'})
            return
        }

        if(course == ''){
            enqueueSnackbar("Select your Stream", {variant: 'error'})
            return
        }

        if(year == ''){
            enqueueSnackbar("Select your Year", {variant: 'error'})
            return
        }

        try{
            SetQrId(uuid())
            const {data} = await axios.post('/api/students/signup', {name, email, password, registrationNumber, roomNumber, block, year, course, qrId})
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
                    Sign Up for Students
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
                        <Controller name="registrationNumber" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="registrationNumber" label="Registration Number" inputProps={{type: 'text'}} 
                            error={Boolean(errors.registrationNumber)}
                            helperText ={
                                errors.registrationNumber ? 
                                errors.registrationNumber.type === 'minLength'?
                                'Registration number length must be more than 1 '
                                :'Registration number is required'
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
                        <Controller name="roomNumber" control={control} defaultValue="" rules={{
                            required: true,
                            minLength: 2,
                        }} render={({field})=>(
                            <TextField variant="outlined" fullWidth id="roomNumber" label="Room Number" inputProps={{type: 'text'}} 
                            error={Boolean(errors.roomNumber)}
                            helperText ={
                                errors.roomNumber ? 
                                errors.roomNumber.type === 'minLength'?
                                'Room Number length must be more than 1 '
                                :'Room Number is required'
                                :''}
                            {...field}></TextField>
                        )}>

                        </Controller>
                    </ListItem>
                    <ListItem>
                        <Button
                            ref={anchorRefBlock}
                            aria-controls={openBlock ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggleBlock}
                            fullWidth
                            variant='outlined'
                        >
                            {block == 'blockA' ? 'Block A' : block == 'blockB' ? 'Block B' : block == 'blockC' ? 'Block C' : 'Select your block'}<ExpandMoreIcon style={{marginLeft: "1rem"}}/>
                        </Button>
                        <Popper style={{ zIndex: 999999 }} open={openBlock} anchorEl={anchorRefBlock.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseBlock}>
                                            <MenuList autoFocusItem={openBlock} id="menu-list-grow" onKeyDown={handleListKeyDownBlock}>
                                                <MenuItem onClick={()=>handleBlock('blockA')}>Block A</MenuItem>
                                                <MenuItem onClick={()=>handleBlock('blockB')}>Block B</MenuItem>
                                                <MenuItem onClick={()=>handleBlock('blockC')}>Block C</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </ListItem>
                    <ListItem>
                        <Button
                            ref={anchorRefCourse}
                            aria-controls={openCourse ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggleCourse}
                            fullWidth
                            variant='outlined'
                        >
                            {
                                course == 'btechElectricalAndElectronics' ? 'BTech. Electrical and Electronics Engineering'
                                :
                                course == 'btechComputer' ? 'BTech. Computer Science Engineering'
                                :
                                course == 'btechMechanical' ? 'BTech. Mechanical Engineering'
                                :
                                course == 'btechECE' ? 'BTech. Electronics and Communication Engineering'
                                :
                                course == 'btechElectronicsComputer' ? 'BTech. Electronics and Computer Science Engineering'
                                :
                                course == 'btechCivil' ? 'BTech. Civil Engineering'
                                :
                                course == 'btechComputerAI' ? 'BTech. Computer Science and Artificial Intelligence Engineering'
                                : 
                                course == 'btechComputerCyber' ? 'BTech. Computer Science and Cyber Security Engineering'
                                :
                                'Select your stream'
                            } 
                            <ExpandMoreIcon style={{marginLeft: "1rem"}}/>
                        </Button>
                        <Popper style={{ zIndex: 999999 }} open={openCourse} anchorEl={anchorRefCourse.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseCourse}>
                                            <MenuList autoFocusItem={openCourse} id="menu-list-grow" onKeyDown={handleListKeyDownCourse}>
                                                <MenuItem onClick={()=>handleCourse('btechElectricalAndElectronics')}>BTech. Electrical and Electronics Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechComputer')}>BTech. Computer Science Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechMechanical')}>BTech. Mechanical Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechECE')}>BTech. Electronics and Communication Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechElectronicsComputer')}>BTech. Electronics and Computer Science Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechCivil')}>BTech. Civil Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechComputerAI')}>BTech. Computer Science and Artificial Intelligence Engineering</MenuItem>
                                                <MenuItem onClick={()=>handleCourse('btechComputerCyber')}>BTech. Computer Science and Cyber Security Engineering</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </ListItem>
                    <ListItem>
                        <Button
                            ref={anchorRefYear}
                            aria-controls={openYear ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggleYear}
                            fullWidth
                            variant='outlined'
                        >
                            {year == 'first' ? 'First' : year == 'second' ? 'Second' : year == 'third' ? 'Third' : year == 'fourth' ? 'Fourth' : year == 'fifth' ? 'Fifth' : year == 'sixth' ? 'Sixth' : 'Select your '} Year<ExpandMoreIcon style={{marginLeft: "1rem"}}/>
                        </Button>
                        <Popper style={{ zIndex: 999999 }} open={openYear} anchorEl={anchorRefYear.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleCloseYear}>
                                            <MenuList autoFocusItem={openYear} id="menu-list-grow" onKeyDown={handleListKeyDownYear}>
                                                <MenuItem onClick={()=>handleYear('first')}>First</MenuItem>
                                                <MenuItem onClick={()=>handleYear('second')}>Second</MenuItem>
                                                <MenuItem onClick={()=>handleYear('third')}>Third</MenuItem>
                                                <MenuItem onClick={()=>handleYear('fourth')}>Fourth</MenuItem>
                                                <MenuItem onClick={()=>handleYear('fifth')}>Fifth</MenuItem>
                                                <MenuItem onClick={()=>handleYear('sixth')}>Sixth</MenuItem>
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