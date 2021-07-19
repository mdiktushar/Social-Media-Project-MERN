const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

// Load Imput Validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load User model
const User = require('../../models/Users')

// @route  GET api/users/test
// @des    Test users route
// @access Public
router.get('/test', (req, res) => res.json({
        msg: "User Works"
    })
)

// @route  POST api/users/register
// @des    Register route
// @access Public
router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body)

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            errors.email = 'Email already user for an account'
            return res.status(400).json(errors.email)
        }
        const avatar = gravatar.url(req.body.email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
        })
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.password
        });
        bcrypt.genSalt(8, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then(
                    user => res.json(user)
                ).catch(err => console.log(err))
            })
        })
    })
})

// @route  GET api/users/login
// @des    Login User/Returning Token
// @access Public
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body)

    // Check Validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by Email
    User.findOne({email}).then(user => {
        if(!user) { //Chek for user
            errors.email = 'Email not found'
            return res.status(404).json(errors.email)
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(!isMatch) { // Incorrect Passowrd
                errors.password = 'Incorrect Passowrd'
                return res.status(400).json(errors.password)
            }
            // User Matched 
            const payload = { // jwt Payload
                id: user.id,
                name: user.name,
                avatar: user.avatar
            }
            //Sign Token
            jwt.sign(
                payload,
                keys.secretOrkey,
                {expiresIn: 86400}, // Token life time is One day
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer '+token
                    })
                })
        })

    })
})

// @route  GET api/users/current
// @des    Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        // res.json(req.user)
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
    }
)
module.exports = router;