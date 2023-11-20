const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {

     res.render('signup', {userEmail: req.app.get('userEmail'), categories: req.app.get('categories')})
   
})



router.post('/', (req, res)=>{

    const db = req.app.get('DB');

    const {FirstName, LastName, Email, password, RepeatPass } = req.body;
    
    const email = db.get('users').find({email : Email}).value()
    
    //Check Input Password if math with Confirm Password
    if (RepeatPass === password){  
                if(!email){
                    
                    bcrypt.hash(password, 10, (err, hashPassword)=>{
                        db.get('users').push(
                            {
                                id: Date.now(),
                                fName: FirstName,
                                lName: LastName,
                                email : Email,
                                password: hashPassword
                            }

                            ).write()
               
                        res.redirect('/')
                    })

                }else{
                    res.render('signup', {userEmail: req.app.get('userEmail'), categories: req.app.get('categories'), alert: ` <div class="AlertMessage" ><i class="bi bi-exclamation-octagon-fill"></i><p>Email already exist</p></div> `});
                }
    }else{

        res.render('signup', {userEmail: req.app.get('userEmail'), categories: req.app.get('categories'), alert: ` <div class="AlertMessage" ><i class="bi bi-exclamation-octagon-fill"></i><p>Password and Confirm password doesn't matched</p></div> `});

    }

    
})


module.exports  = { router }