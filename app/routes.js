module.exports = (app) => {
    const user = require('./controllers/usercontroller');
    const { check, validationResult } = require('express-validator/check');

    app.post('/signup', [check('email').isEmail(),
    check('password').isLength({min:5})], user.create);

    app.post('/signin', user.signIn)
}