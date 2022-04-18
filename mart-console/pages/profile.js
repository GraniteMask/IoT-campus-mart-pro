import React, { useRef, useState } from 'react'
import { Button, List, ListItem, TextField, Typography, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, ListItemText, Card, Grid} from '@material-ui/core'
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

function Profile() {
    const {state, dispatch} = useContext(Store)
    const { userInfo } = state
    const [openBlock, setOpenBlock] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [openCourse, setOpenCourse] = useState(false);
    const [block, setBlock] = useState(userInfo.block)
    const [year, setYear] = useState(userInfo.year)
    const [course, setCourse] = useState(userInfo.course)
    const {handleSubmit, control, formState: {errors}, setValue} = useForm()
    const router = useRouter()
    const classes = useStyles()
    const {enqueueSnackbar, closeSnackbar} = useSnackbar()
    const anchorRefBlock = useRef(null);
    const anchorRefYear = useRef(null);
    const anchorRefCourse = useRef(null);


    useEffect(()=>{
        if(!userInfo){
            return router.push('/login')
        }

        setValue('name', userInfo.name)
        setValue('email', userInfo.email)
        setValue('registrationNumber', userInfo.registrationNumber)
        setValue('roomNumber', userInfo.roomNumber)
    }, [])

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

    


    const submitHandler = async ({name, email, password, confirmPassword, roomNumber}) =>{
        // e.preventDefault()
        closeSnackbar()
        if(password !== confirmPassword){
            // alert("Password don't matched")
            enqueueSnackbar("Password and Confirm Password don't matched", {variant: 'error'})
            return
        }

        try{
            const {data} = await axios.put('/api/students/student-profile', {password, block, year, roomNumber},{
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
                                    <ListItemText primary="Student Profile"></ListItemText>
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
                                   Student Profile
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
                                        <Controller name="registrationNumber" control={control} defaultValue="" rules={{
                                            required: true,
                                            minLength: 2,
                                        }} render={({field})=>(
                                            <TextField variant="outlined" fullWidth id="registrationNumber" label="Registration Number" inputProps={{type: 'text'}}  disabled
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
                                            disabled
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