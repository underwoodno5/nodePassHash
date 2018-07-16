module.exports = (app) => {
    const user = require('./controllers/usercontroller');

    app.post('/signup', user.create);
}