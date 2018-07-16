const User = require('../models/users')
const bcrypt = require('bcrypt');


//-----------------
//-- CREATING USERS
//-----------------
exports.create = (req,res)=>{

    const { body } = req;
    const { password } = body;
    let {email} = body;

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
    


    const newUser = new User({
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null), // this is our hashing function
    });

    //-- saving new note --\\

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
