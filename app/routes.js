module.exports = (app) => {
    const user = require('./controllers/usercontroller');
    const { body } = require('express-validator/check');
    const { check, validationResult } = require('express-validator/check');
    const User = require('./models/users');

    //------------
    //-- HOMEPAGE
    //-----------
    app.get('/', function(req,res){
        res.render('index', {title: 'Form Validation', success: req.session.success, errors: req.session.errors });
        req.session.errors = null;
        req.session.success = false;

    });


    //---------
    //-- SIGNUP
    //---------
    //-- custom validation for checking if email exists in DB
    app.post('/signup', 
    check('email').custom(async (value,{req})=>{
        let user = await User.findOne({ email: value });
        if(user){
            return false;
        }
     }) .withMessage('Email already exists'),  user.create);
    
    
    //---------
    //-- SIGNIN
    //---------
    app.post('/signin', user.signIn);

   


} 