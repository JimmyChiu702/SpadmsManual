const express = require('express');
const apiRouter = require('./router/apiRouter');
const signinRouter = require('./router/signinRouter');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const view = require('./model/view');
const formidable = require('formidable');

const app = express();

app.use(express.static('dist'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'nthu-spadms-manual'}));
app.use('/signin', express.static('dist/signin'));
app.use(signinRouter);
app.use('/manual', view.manual); 
app.use('/api', apiRouter); 

const port = 80;
app.listen(port, () => {
    console.log(`Server is up and running on pot ${port}...`);
});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           