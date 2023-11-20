const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const axios = require('axios')
const Promise = require('promise');
const app = express();
const loginRoute = require('./routes/login')
const signUpRoute = require('./routes/signup')
const categoryRoute = require('./routes/category')
const {router, productsDataArrayToObject} = require('./routes/product')
const bodyParser = require('body-parser')
const session = require('express-session');

const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const adapter = new FileAsync('db.json')

app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

app.get('/' , (req, res) => {
    
    Promise.all([
     axios.get('https://dummyjson.com/products?limit=0'),
     axios.get('https://dummyjson.com/products/categories')])

        .then(function(result){    
            
            const productsResult = result[0].data;
            const categoriesResult = result[1].data

            app.set('categories', categoriesResult)
            
            const featured = []

            for (const product of productsResult.products) {
            
                if(product.rating > 4.8){
                    featured.push(product)
                }
            }
            
            const userEmail = req.session.userEmail
            app.set('userEmail', userEmail)
            const fetureProducts =  productsDataArrayToObject(featured);
           
            res.render('index', {products: fetureProducts, categories : categoriesResult , userEmail: userEmail});
        })
 
    });
    
    

app.get('/about', (req, res)=>{
    res.send("About")
})

app.use('/products', router)
app.use('/category', categoryRoute.router)
app.use('/login', loginRoute.router )
app.use('/signup', signUpRoute.router)


app.post('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect('/')
    })
})


low(adapter).then(function (db) {
    db.defaults({users : [], carts : []}).write()
    app.set('DB', db)
}).then(function (){
    app.listen(3000, () => {
        console.log(`Example app listening on port http://127.0.0.1:3000/`)
    })
    
})

