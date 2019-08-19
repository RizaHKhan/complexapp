//bring in express and tell the app that it is required
const express = require('express');
const session = require('express-session');
const csrf = require('csurf')
const markdown = require('marked');
const sanitizeHTML = require('sanitize-html')
const MongoStore = require('connect-mongo')(session);

const flash = require('connect-flash');

//have app use express
const app = express();

//how to use sessions, boiler plate configuration, do not memorize
let sessionOptions = session({
    secret: "JS is sooooo cool", 
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
});

app.use(sessionOptions);

app.use(flash())


app.use(function(req, res, next) {

    //make our markdown function available from within ejs templates
    res.locals.filterUserHTML = function(content) {
        return sanitizeHTML(markdown(content), {allowedTags: ['p', 'br', 'ol', 'li', 'em', 'h1', 'h2', 'h6'], allowedAttributes: {}})
    }
    
    //make all error and success flash messages available from all templates
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');

    //make current user id available on the req object
    if(req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

    //make user session data available from within view templates
    res.locals.user = req.session.user;
    next();
})

//point the router variable to the file we want to execute.
const router = require('./router');

//boilerplate code, no need to memorize. puts users inputted data so we can access it.
app.use(express.urlencoded({extended: false}))
//another common way for submmitted data on the web
app.use(express.json());

//pulling in the main css file.
app.use(express.static('public'));

//first views is an express option, second is the name of the file
app.set('views', 'views');
//let express know the type of template system is being used.
app.set('view engine', 'ejs');

app.use(csrf())
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/', router);

app.use(function(err, req, res, next) {
    if (err) {
        if (err.code == 'EBADCSRFTOKEN') {
            req.flash('errors', 'Cross site request forgery detected')
            req.session.save(()=> res.redirect('/'))
        } else {
            res.render('404')
        }
    }
})


const server = require('http').createServer(app)

const io = require('socket.io')(server)

io.on('connection', function() {
    console.log('A new user connected');
})

module.exports = server