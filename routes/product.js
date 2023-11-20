const express = require('express')
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) =>{
    
    const LIMIT = 20;

    const PAGE = req.query.page ? (LIMIT * parseInt(req.query.page)) - LIMIT : 0

    axios.get(`https://dummyjson.com/products?limit=${LIMIT}&skip=${PAGE}`)
    
    .then(function (response) {
        
        const products = response.data.products;
        
        if(products.length <= 0) res.sendStatus(404)
        
        const data = productsDataArrayToObject(products)
        
        res.render('products',  {userEmail: req.app.get('userEmail'),categories: req.app.get('categories'), products: data})
        
    })
    
})

router.get('/:id', (req, res) => {
    
    axios.get(`https://dummyjson.com/products/${req.params.id}`)
    
    .then(function (response) {
        
        const product = response.data;
        const data = singleProductObject(product)

        const email = req.session.userEmail
       // console.log(product)
        res.render('product_details', {product: data ,  userEmail: email, categories: req.app.get('categories') } )
        
    }).catch((err) =>{
        
        console.error('Something went Wrong' + err)
    })
})

function singleProductObject(p){
    return {
        id: p.id,
        title: p.title,
        desc: p.description,
        discount : p.discountPercentage,
        price: p.price,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand,
        imgs : p.images
    }
}

function productsDataArrayToObject(products){
    
    const arr = []
    
    for (const product of products) {
       
        const productInfo = {
            id: product.id,
            title: product.title,
            price: product.price,
            rating: product.rating,
            cat: product.category,
            stock: product.stock,
            image: product.thumbnail
        }
        
        arr.push(productInfo)
    }
    return arr;
}
    




module.exports = {router,  productsDataArrayToObject}