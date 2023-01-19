"use strict"
const Article = require('./model.js').Article
const User = require('./model.js').User
const Profile = require('./model.js').Profile
var objectId = require('mongodb').ObjectID
var mongoose = require('mongoose')

// This is the stub for article
const articles = [{id:1, author: "user1", text: "text for user1", comment:[], date: new Date()},
                 {id:2, author: "user2", text: "text for user2", comment:[], date: new Date()},
                 {id:3, author: "user3", text: "text for user3", comment:[], date: new Date()}]

let currentId = 4

//const hello = (req, res) => res.send({ hello: "hello" })

//update the article
const updateArticle = (req, res) => {
    let id = req.params.id
    if(!id){
        res.status(400).send("Please provide an valid ID")
    }else{
        articles.filter(article => {
            if(article.id == id){
                article.text = req.body.text
            }
        })
        res.status(200).send("The article has been updated!")
    }
}


//post an article as logged-in user
const postArticle = (req, res) => {
    const username = req.username          //get the loggedin user's username 
    const text = req.body.text             //get the new article's text

    if(!text){
        res.status(400).send("No Text")
    }

    //add article to the database
    new Article({ author: username, body:  text, date: new Date(), picture: "", comments: []}).save(function (err, article) {
        if (err) {
            res.status(400).send(err)
            return
        }
        res.status(200).send({articles: [article]})
        return
    })
}


//get the articles
const getArticles = (req, res) => {
    let articleId
    let username
    if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)){
        articleId = req.params.id
    }else if(req.params.id){
        username = req.params.id
    }

    if(articleId){
        Article.find({"_id": objectId(articleId)}).exec(function(err, articles){
            if(err){
                res.status(400).send(err)
                return
            }
            if(articles){
                res.status(200).send({articles: articles})
                return
            }else{
                res.status(400).send("There is no matching article")
            }
        })
    }else if(username){
        Article.find({author: username}).exec(function(err, articles){
            if(err){
                res.status(400).send(err)
                return
            }
            res.status(200).send({articles: articles})
        })
    }else{  //this will return all the loggedin user's articles and his friends' articles
        const username = req.username
        if(!username){
            res.status(400).send("There is no logged-in user")
        }
        Profile.find({username: username}).exec(function(err, profiles){
            if(err){
                res.status(400).send(err)
                return
            }
            if(!profiles || profiles.length == 0){
                res.status(400).send("Can't find the user's profile")
                return
            }
            const profileObj = profiles[0]
            const allUsers = [username, ...profileObj.following]
            Article.find({author: {$in: allUsers}}).sort({date: -1}).exec(function(err, articles){
                if(err){
                    res.status(400).send(err)
                    return
                }
                res.status(200).send({articles: articles})
            })
        })

    }
}


module.exports = (app) => {
    app.post("/article", postArticle)
    app.get("/articles/:id?", getArticles)
}


