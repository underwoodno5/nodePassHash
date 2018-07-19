module.exports = (app) => {
    const user = require('./controllers/usercontroller');
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
    //-- custom validation for sanitising {} and checking if email exists in DB
    app.post('/signup',
    
    check('email').custom(async (value)=>{
         if(value.includes('{')|| value.includes('}')){
             return false;
         }
      }) .withMessage('cannot use curly braces in email'),

    check('email').custom(async (value)=>{
       let user = await User.findOne({ email: value });
        if(user){
            return false;
        }
     }) .withMessage('Email already in use'),  user.create);
    
    
    //---------
    //-- SIGNIN
    //---------
    app.post('/signin',
        check('email').custom(async (value)=>{
            let user = await User.findOne({ email: value });
            if(!user){
                return false;
            }    
        }) .withMessage('no account with that email'), user.signIn);

   


} 