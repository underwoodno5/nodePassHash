const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

//--------------
//-- USER MODEL
//--------------
const userSchema = mongoose.Schema({
    email: String,
    password: String,
});


//------------
//--- METHODS
//------------

    //-- generating a hash --\\

// userSchema.methods.generateHash = function(password){
  //      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
 //};

  /*  //-- password validation check --\\
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};*/

module.exports = mongoose.model ('User', userSchema);  