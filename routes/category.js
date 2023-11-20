const express = require('express')
const router = express.Router();
const axios = require('axios')
const {productsDataArrayToObject} = require('../routes/product')

router.get('/:catName', (req, res)=>{
    
    axios.get(`https://dummyjson.com/products/category/${req.params.catName}`)
    .then(function(response) {
        
        const productsResult = response.data.products;

        const products = productsDataArrayToObject(productsResult)
        
        res.render('product_per_category', {
            products: products, 
            categories: req.app.get('categories'),
            category: req.params.catName,
            userEmail: req.session.userEmail
        })

    })
    
    
   
})



module.exports = {router}