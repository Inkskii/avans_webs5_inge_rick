//Requires
require('dotenv').config();
let express = require('express');
let path = require('path');
const passport = require('passport');
let bodyParser = require('body-parser');
let middleware = require('./middleware/roleMiddleware');

let app = express();


//const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?authSource=admin&replicaSet=atlas-l4qtyj-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
//Mongoose Connection
let mongoose = require('mongoose')
mongoose.connect(uri);
//mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true});
console.log(uri)
//Models
require('./models/user');
require('./auth/auth');
require('./models/target');
require('./models/upload');

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(27017, () => {
    console.log("Server running on port 27017");
});

//Routes for User
app.use('/', require('./routes/auth'));
app.use('/targets', passport.authenticate('jwt', { session: false }), require('./routes/targets')(handleError))
app.use('/uploads', passport.authenticate('jwt', { session: false }), require('./routes/uploads')(handleError))

//Routes for Admin
app.use('/users', passport.authenticate('jwt', { session: false }), require('./routes/users')(handleError));

module.exports = app;