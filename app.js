const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');
const bodyParser = require('body-parser'); //////////////
const partials = require('express-partials');
const app = express();

const mysql = require('mysql');

app.use(partials());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //////
 
// parse application/json
app.use(bodyParser.json()); ///////

app.use(express.static(__dirname)); //this shit is to move to css directory correctly
//app.use('/images/phone', express.static('images/phone'));

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: "views/layouts/",
    extname: "hbs",
    helpers: {
        section: hbs_sections()
    }
}));
app.set('view engine', 'hbs');

app.use(async function(req, res, next) {
    if(req.session.isAuthenticated === null) {
        req.session.isAuthenticated = false;
    }
    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;
    next();
})

const categoryModel = require('./models/listproduct_model');
app.use(async function(req, res, next){
    const rows = await categoryModel.allCatWithDetails();
    res.locals.lcCategories = rows;
    next();
})

app.get('/', function(req, res){
    res.render('home1');
})

app.use('/listproduct', require('./routes/listproduct'));
app.use('/account', require('./routes/account_route'));

app.use(function (req, res) {
    res.render('404', {
        layout : false
    });
})

app.post('/email', (req, res) => {
    // you have address available in req.body:
    console.log(req.body.address);
    // always send a response:
    res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, function(){
    console.log('Server is running');
})