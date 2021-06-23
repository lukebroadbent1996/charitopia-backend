const express = require('express');
const { response } = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')

const register = require("./routes/registerRouter");
const login = require("./routes/loginRouter")
const api = require('./routes/api')

require('dotenv').config()

const app = express();
app.set('trust proxy', 1);


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));


app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    key: "userId",
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24*1000,
    } 
}))


app.use( register);
app.use( login);
app.use('/api', api)


app.listen(3001, ()=>{
    console.log('Server running on port 3001')
})