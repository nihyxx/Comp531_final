"use strict"
//profile.js contains all user profile 
//stub user profiles 
const Profile = require('./model.js').Profile

const profiles = [
    {
        username: 'DLeebron',
        headline: 'This is my headline!',
        email: 'foo@bar.com',   
        zipcode: 12345,
        dob: '128999122000',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    },
    {
        username: 'user1',
        headline: 'This is user1 headline',
        email: 'user1@rice.edu',
        zipcode: 45678,
        dob: '128999122001',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    },
    {
        username: 'user2',
        headline: 'This is user2 headline',
        email: 'user2@rice.edu',
        zipcode: 78901,
        dob: '128999122002',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    },
    {
        username: 'user3',
        headline: 'This is user3 headline',
        email: 'user3@rice.edu',
        zipcode: 20134,
        dob: '128999122003',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    }
]

const profile = {
    username: 'DLeebron',
    headline: 'This is my headline!',
    email: 'foo@bar.com',
    zipcode: 12345,
    dob: '128999122000',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
}

let loggedInUser = "DLeebron"

const getUserName = (req, res) => {
    let username = req.username

    Profile.find({username: username}).exec(function(err, profiles){
        if(err){
            return console.log(err)
        }
        if(!profiles || profiles.length == 0){
            res.status(400).send({Msg: "No user found"})
            return
        }
        const profile = profiles[0]
        res.status(200).send({username: username})
        return
    })
}

const getHeadline = (req, res) => {
    let username = req.params.user
    if(!username){
        username = req.username
    }
    Profile.find({username: username}).exec(function(err, profiles){
        if(err){
            return console.log(err)
        }
        if(!profiles || profiles.length == 0){
            res.status(400).send({Msg: "No user found"})
            return
        }
        const profile = profiles[0]
        res.status(200).send({username: username, headline: profile.headline})
        return
    })
}


const updateHeadline = (req, res) => {
    const username = req.username
    const headline = req.body.headline
    if(!username){
        res.status(400).send("You need to provide a username")
        return
    }
    if(!headline){
        res.status(400).send("Please provide a headline")
        return
    }

    Profile.updateOne({username: username}, {$set: {headline: headline}}, function(err, profile){
        if(err){
            res.status(400).send(err)
            return
        }
        res.status(200).send({username: username, headline: headline})
        return
    })
}

const getAvatar = (req, res) => {
    let userName
    if(!req.params.user){
        userName = req.username
    }else{
        userName = req.params.user
    }
    let userFound = false
    profiles.filter(profile => {
        if(profile.username == userName){
            userFound = true
            let toReturn = {username: userName, avatar: profile.avatar}
            res.status(200).send(toReturn)
            return
        }
    })
    if(userFound == false){
        res.status(400).send({Msg: "No User found"})
    }
}


//update the avatar of the user
const updateAvatar = (req, res) => {
    let _avatar = req.body.avatar
    if(!_avatar){
        res.status(400).send("You need to provide a avatar!")
        return 
    }
    profiles.filter(profile => {
        if(profile.username == loggedInUser){
            profile.avatar = _avatar
            let toReturn = {username: loggedInUser, avatar: _avatar}
            res.status(200).send(toReturn)
            return
            }
        })
}


const getEmail = (req, res) => {
    let username
    if(!req.params.user){
        username = req.username
    }else{
        username = req.params.user
    }


    Profile.find({username: username}).exec(function(err, profiles){
        if(err){
            return console.log(err)
        }
        if(!profiles || profiles.length == 0){
            res.status(400).send({Msg: "No User found"})
            return
        }
        const profile = profiles[0]
        res.status(200).send({username: username, email: profile.email})
        return
    })
}


const updateEmail = (req, res) => {
    let _email = req.body.email
    if(!_email){
        res.status(400).send("You need to provide a email")
        return 
    }
    profiles.filter(profile => {
        if(profile.username == loggedInUser){
            profile.email = _email
            let toReturn = {username: loggedInUser, email: _email}
            res.status(200).send(toReturn)
            return
            }
        })
}


const getZipcode = (req, res) => {
    let username
    if(!req.params.user){
        username = req.username
    }else{
        username = req.params.user
    }

    Profile.find({username: username}).exec(function(err, profiles){
        if(err){
            return console.log(err)
        }
        if(!profiles || profiles.length == 0){
            res.status(400).send({Msg: "No user found"})
            return
        }
        const profile = profiles[0]
        res.status(200).send({username: username, zipcode: profile.zipcode})
        return
    })
}

const updateZipcode = (req, res) => {
    let _zipcode = req.body.zipcode
    if(!_zipcode){
        res.status(400).send("You need to provide a zipcode!")
        return 
    }
    profiles.filter(profile => {
        if(profile.username == loggedInUser){
            profile.zipcode = _zipcode
            let toReturn = {username: loggedInUser, zipcode: _zipcode}
            res.status(200).send(toReturn)
            return
            }
        })
}


const getDob = (req, res) => {
    let userName
    if(!req.params.user){
        userName = req.username
    }else{
        userName = req.params.user
    }

    let userFound = false
    profiles.filter(profile => {
        if(profile.username == userName){
            userFound = true
            let toReturn = {username: userName, dob: profile.dob}
            res.status(200).send(toReturn)
            return
        }
    })
    if(userFound == false){
        res.status(400).send({Msg: "No user found"})
    }
}



module.exports = (app) => {
    app.get("/username", getUserName)
    app.get("/headline/:user?", getHeadline)
    app.put("/headline", updateHeadline)
    app.get("/avatar/:user?", getAvatar)
    app.put("/avatar", updateAvatar)
    app.get("/email/:user?", getEmail)
    app.put("/email", updateEmail)
    app.get("/zipcode/:user?", getZipcode)
    app.put("/zipcode", updateZipcode)
    app.get("/dob/:user?", getDob)
}