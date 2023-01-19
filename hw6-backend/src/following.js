"use strict"
const followingList = [
    {
        username: "hn22",
        friends: ["etain", "DLeebron"]
    }
]

let loggedInUser = "hn22"           //this is stub loggedInUser

//get the list of users being followed by the requested user
const getFriends = (req, res) => {
    let userName = req.params.user
    let userFound = false
    followingList.filter(item => {
        if(item.username == userName){
            userFound = true
            let toReturn = {username: userName, following: item.friends}
            res.status(200).send(toReturn)
            return
        }
    })
    if(userFound == false){
        res.status(404).send("There is no user related to the username")
    }
}

//add :user to the following list for the logged in user
const addFriend = (req, res) => {
    let friendName = req.params.user
    if(!friendName){
        res.status(400).send("You need to provide a friend\'s name!")
        return 
    }
    followingList.filter(item => {
        if(item.username == loggedInUser){
            item.friends.push(friendName)
            let toReturn = {username: loggedInUser, following: item.friends}
            res.status(200).send(toReturn)
            return
            }
        })
}


const deleteFriend = (req, res) => {
    let friendName = req.params.user
    if(!friendName){
        res.status(400).send("You need to provide a friend\'s name!")
        return 
    }
    let friendExist = false
    followingList.filter(item => {
        if(item.username == loggedInUser){
            let friendList = item.friends
            let stillFriends = friendList.filter(friendNameLs => {
                if(friendNameLs != friendName){
                    return friendNameLs
                }else{
                    friendExist = true
                }
            })

            item.friends = stillFriends

            let toReturn = {username: loggedInUser, following: item.friends}

            if(friendExist == true){
                res.status(200).send(toReturn)
                return
            }else{
                res.status(404).send("Friend not exists")
                return
            }


            }
        })
}


module.exports = (app) => {
    app.get("/following/:user?", getFriends)
    app.put("/following/:user", addFriend)
    app.delete("/following/:user", deleteFriend)
}