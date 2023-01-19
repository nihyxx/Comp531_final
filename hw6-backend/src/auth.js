"use strict"

const cookieKey = 'sid'
const sessionUser = new Map()
const cookieParser = require('cookie-parser')
const md5 = require('md5')
const secret = "this is my secret"
const User = require('./model.js').User
const Profile = require('./model.js').Profile


const register = (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const dob = req.body.dob
    const zipcode = req.body.zipcode
    const password = req.body.password

    if (!username || !email || !dob || !zipcode || !password) {
        res.status(400).send({Msg: "Please provide all the necessary information to register"})
        return
    }

    User.find({ username: username }).exec(function (err, users) {
        if (err) {
            res.status(400).send({Msg: err})
            return
        }
        if (users.length > 0) {
            res.status(400).send({Msg: "The username has been registered!"})
            return
        }
        const salt = username + new Date().getTime()
        const hash = md5(password + salt)

        new User({ username: username, salt: salt, hash: hash }).save(function (err, user) {
            if (err) {
                res.status(400).send({Msg: err})
                return
            }
        })

        new Profile({ username: username, headline: "", following: [], email: email, dob: dob, zipcode: zipcode, avatar: "" }).save(function (err, profile) {
            if (err) {
                res.status(400).send({Msg: err})
                return
            }
        })
        res.status(200).send({ result: "success", username: username })
        return
    })
}



const login = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username || !password) {
        res.status(400).send({Msg: "You need to provide a username and password"})
        return
    }

    User.find({ username: username }).exec(function (err, users) {
        if (err) {
            res.status(400).send({Msg: err})
            return
        }
        if (!users || users.length == 0) {
            res.status(400).send({Msg: "No user found"})
            return
        }
        const userObj = users[0]
        const salt = userObj.salt
        const hash = userObj.hash

        if (md5(password + salt) === hash) {
            const sessionKey = md5(secret + new Date().getTime() + userObj.username)
            sessionUser.set(sessionKey, userObj)
            res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true })
            res.status(200).send({ username: username, result: "success" })
        } else {    
            res.status(400).send({Msg: 'wrong password'})
        }
    })
}


const isLoggedIn = (req, res, next) => {
    const sid = req.cookies[cookieKey]

    if (!sid) {
        return res.sendStatus(401)
    }

    const userObj = sessionUser.get(sid)
    const username = userObj.username
    if (username) {
        req.username = username
        next()
    } else { 
        res.sendStatus(401)
    }
}

const logout = (req, res) => {
    const sid = req.cookies[cookieKey]
    sessionUser.delete(sid)
    res.clearCookie(cookieKey)
    res.status(200).send({result: "successfully log out"})
}


const updatePassword = (req, res) => {
    const newPassword = req.body.password
    const sid = req.cookies[cookieKey]
    const userObj = sessionUser.get(sid)         
    const username = userObj.username

    if(!newPassword){
        res.status(400).send({Msg: "You need to provide a password!"})
        return
    }

    User.find({username: username}).exec(function(err, users){
        if(err){
            res.status(400).send({Msg: err})
            return
        }
        if(users.length == 0){
            res.status(400).send({Msg: "No user found"})
            return
        }

        const newSalt = username + new Date().getTime()
        const newHash = md5(newPassword + newSalt)

        User.updateOne({username: username}, {$set: {salt: newSalt, hash: newHash}}, function(err, user){
            if(err){
                res.status(400).send({Msg: err})
                return
            }
            res.status(200).send({username: username, result: "success"})
            return
        })
    })    

}


module.exports = (app) => {
    app.use(cookieParser())
    app.post("/register", register)
    app.post("/login", login)
    app.use(isLoggedIn)
    app.put("/logout", logout)
    app.put("/password", updatePassword)
}
