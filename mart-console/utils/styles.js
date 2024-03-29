import {makeStyles} from "@material-ui/core" 

const useStyles = makeStyles((theme)=>({
    navbar:{
        backgroundColor: "#000000",
        // backgroundColor: "#203040",
        '& a':{
            color: "#FFFFFF",
            marginLeft: 10,   //by default it is 10px
        },
    },
    main:{
        minHeight: "80vh",
    },
    footer:{
        textAlign: "center",
        marginTop: 10,
    },
    brand:{
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    grow:{
        flexGrow: 1,
    },
    section:{
        marginTop: 10,
        marginBottom:10,
    },
    form:{
        width: "100%",
        maxWidth: 800,
        margin: '0 auto',
    },
    navbarButton:{
        color: '#ffffff',
        textTransform: 'initial'
    },
    transparentBackground:{
        backgroundColor: 'transparent'
    },
    error:{
        color:'#f04040'
    },
    fullWidth:{
        width: '100%'
    },
    reviewForm:{
        maxWidth: 800,
        width: '100%',
    },
    reviewItems:{
        marginRight: '1rem',
        borderRight: '1px #808080 solid',
        paddingRight: '1rem', 
    },
    toolbar:{
        justifyContent: 'space-between'
    },
    mt1: { marginTop: '1rem' },
    //search
    searchSection: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
      },
      searchForm: {
        border: '1px solid #ffffff',
        backgroundColor: '#ffffff',
        borderRadius: 5,
      },
      searchInput: {
        paddingLeft: 5,
        color: '#000000',
        '& ::placeholder': {
          color: '#606060',
        },
      },
      iconButton: {
        backgroundColor: '#f8c040',
        padding: 5,
        borderRadius: '0 5px 5px 0',
        '& span': {
          color: '#000000',
        },
    },
    sort:{
        marginRight: 5,
    },
    featuredImage:{
        width: '100%'
    },
    fullContainer: { height: '100vh' },

    
    

}));

export default useStyles