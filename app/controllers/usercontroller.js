const User = require('../models/users');
const UserSession = require('../models/userSession');
const bcrypt = require('bcrypt');
const { sanitizeParam } = require('express-validator/filter');



//-----------------
//-- CREATING USERS
//-----------------
exports.create = (req,res)=>{

  //------- check validation and return home if failed, execute POST if pass
    req.sanitize('email').escape('/');
    req.sanitize('password').escape('/');
    req.sanitize('password').escape('{');
    req.check('email', 'Invalid email').isEmail();
    req.check('password', 'Password is too short').isLength({min: 4});
    
    var errors = req.validationErrors();
    if(errors){
      req.session.errors = errors;
      req.session.success = false;
      return res.redirect('back');
      ;
    }else{
      req.session.success = true;
    }
    

    const { body } = req;
    const { password } = body;
    let {email} = body;

//---- checking if new user exists

  /*User.find({
        email: email,
    },(err, oldUsers)=>{
        if(err){
            return res.send({
                success: false,
                message: 'some kind of server error'
            });
        }else if(oldUsers.length > 0){
          return res.send({
            success: false,
            message: 'email in use'
        });
      }*/

//---- creating new user
    const newUser = new User();
        newUser.email = email;
        newUser.password = password;//newUser.generateHash(password); // this is our hashing function
  
//----- saving new user

      newUser.save(function(err){
        if(err){
           res.status(500).send({
            message: err.message || "something went wrong saving"
          });
        }else{
          return res.redirect('back');
        }
    });   
// });
};

//-----------------
//--  USER SIGN-IN
//-----------------
exports.signIn = (req, res) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;


//-- error handling empty forms --\\
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    /*User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: no user with that name'
        });
      }*/

  //-- using bcrypt to compare login pass with db pass --\\
      const user = users[0];
      if (!bcrypt.compareSync(password, user.password)) {
        return res.send({
          success: false,
          message: 'Error: wrong password'
        });
      }

      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }

        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
   //});
};