const express = require('express');
const app = express();
require("./db.js");
app.set('view engine','hbs');
app.set('views',__dirname+'/views');
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser')
app.use(cookieParser());

const baiscroutes = require("./routes/basic.js");
const loginroutes = require("./routes/login.js");
const loginWithGoogleroutes = require("./routes/loginWithGoogle.js")

const session = require('express-session')
const passport = require('passport');


app.use(session({
    secret: 'my secreate key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());


app.use("/",baiscroutes);
app.use("/auth",loginroutes);
app.use("/authGoogle",loginWithGoogleroutes);

app.get('/*', (req, res) => {
    res.status(404).render('404error.hbs');
});

const PORT = 3000 || process.env.PORT ; 
app.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`);
})