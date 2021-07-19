const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

// routs
const users = require('./routes/api/user')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello')) //Testing Route

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport)

// User Routs
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log('Server is up on post '+port);
})

// Run the code by: npm run server
