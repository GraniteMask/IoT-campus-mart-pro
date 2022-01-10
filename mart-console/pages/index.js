/* eslint-disable @next/next/no-img-element */
import { Card, CardActionArea, Grid, CardMedia, CardContent, Typography, CardActions, Button, Link } from '@material-ui/core'
import Layout from '../components/Layout'
import NextLink from 'next/link'
import db from '../utils/db'
import Product from '../models/Product'
import axios from 'axios'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import { useRouter } from 'next/router'
import useStyles from '../utils/styles'


export default function Home(props) {
  const classes = useStyles()
  const {products} = props
  console.log(products)
  const {state, dispatch} = useContext(Store)
  const router = useRouter()

  // console.log(products)

  const addToCartHandler = async (product) =>{
    
    // if(data.countInStock <= 0){
    //     window.alert('sorry, product is out of stock')
    //     return
    // }

    

    // const existItem = state.cart.cartItems.find(x=>x._id === product._id) 
    // const quantity = existItem ? existItem.quantity + 1 : 1;
    // const {data} = await axios.get(`/api/products/${product._id}`)

    // if(data.countInStock < quantity){
    //   window.alert('sorry, product is out of stock')
    //   return
    // }

    // dispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}})
    // router.push('/cart')
  }

  return (
    <Layout>

      
      <Typography variant="h2">Popular Products</Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product._id}>
              <Card>
                <NextLink href={`/product/${product.productName}`} passHref>
                  <CardActionArea>
                    {/* <CardMedia
                       component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia> */}
                    <CardContent>
                      <Typography>{product.productName}</Typography>
                      <Typography>{product.manufacturingDate}</Typography>
                      <Typography>{product.productCategory}</Typography>
                      <Typography>Rs.{product.productPrice}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  
                  <Button size="small" color="primary" onClick={()=>addToCartHandler(product)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

            {/* <Grid item md={4} >
              <Card>
                <NextLink href={`/product/sdsdsds`} passHref>
                  <CardActionArea>
                    <CardMedia
                       component="img"
                      // image={product.image}
                      title="P1"
                    ></CardMedia>
                    <CardContent>
                      <Typography>"P1"</Typography>
                      
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>Rs.12222</Typography>
                  <Button size="small" color="primary" onClick={()=>addToCartHandler(product)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid> */}
        </Grid>
    </Layout>
    
  )
}

export async function getServerSideProps(){
  await db.connect()
  const allProducts = await Product.find().lean()
  console.log(allProducts)
  await db.disconnect()
  return{
    props:{
      products: allProducts.map(db.convertDocToObj),
    }
  }
}
