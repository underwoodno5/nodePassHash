const User = require('../models/users');
const UserSession = require('../models/userSession');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator/check');

//-----------------
//-- CREATING USERS
//-----------------
exports.create = (req,res)=>{

    const { body } = req;
    const { password } = body;
    let {email} = body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({errors: errors.array() });
    }

    //-- error handling empty forms --\\
    if (!password){
        return res.status(400).send({
            message: "Password cannot be empty"
        });
    }
    if (!email){
        return res.status(400).send({
            message: "email cannot be empty"
        });
    }
  

    //--checking if new user exists--\\

    User.find({
        email: email,
    },(err, oldUsers)=>{
        if(err){
            return res.send({
                success: false,
                message: 'some kind of server error'
            });
        }else if(oldUsers.length > 0){
            return res.send({
                success:false,
                message: 'user exists with that email'
            });
        }

    //-- creating new user --\\
    const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password); // this is our hashing function
  

    //-- saving new user --\\

    newUser.save()
    .then(data=>{
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message: err.message || "something went wrong saving"
        });
    });
 });
};

exports.signIn = (req, res) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;


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

    User.find({
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
          message: 'Error: Invalid'
        });
      }

      const user = users[0];
      if (!bcrypt.compareSync(password, user.password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
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
    });
} 