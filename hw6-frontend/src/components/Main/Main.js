import React, { Component } from 'react'
import User from './User.js'
import Post from './Post.js'
import './Main.css';
import { Container } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import {Redirect} from 'react-router-dom'


export class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userId: localStorage.getItem("userId"),             //id of the user who logged in
            userName: "",          //name of the currently logged-in user
            users: "",             //information of all users
            posts: "",             //information of all posts
            status: "",            //status of the logged in user
            friendsList: [],        //list of ids of all the friends of the logged-in user
            friends: [],           //list of all the friends including three initial friends and added friends later
            newFriendName: "",      //the new friend name
            userPosts: [],           //posts of the logged-in user
            timeStamp: 0,             //timestamp of the post, add 1 when posting a new post
            newPost: "",               //new post the user tries to post
            searchPost: "",             //post that is searched in the search box
            filteredPosts: ""           //posts after search

        }

        this.change = this.change.bind(this)
        this.addFriend = this.addFriend.bind(this)
        this.getUserName = this.getUserName.bind(this)
        this.removeFriend = this.removeFriend.bind(this)
    }

    componentDidMount = () => {
        this.fetchPosts()
        this.fetchUsers()
    }


    getUserFriendIds = () => {
        let friendArray = []
        let friendID = parseInt(this.state.userId)
        for (let i = 1; i < 4; i++) {
            friendID += 1
            if (friendID > 10) {
                friendID = friendID % 10
            }
            friendArray.push(friendID)
        }
        this.setState({ friendsList: friendArray })
    }


    fetchUsers = async () => {
        let idx = this.state.userId - 1
        const returned = await fetch(
            'https://jsonplaceholder.typicode.com/users'
        );
        const items = await returned.json()
        this.setState({ users: items }, () => {
            this.fetchStatus()
            let statusArray = localStorage.getItem("allStatus").split(",")
            this.setState({ allStatus: statusArray })
            this.setState({ status: statusArray[idx] })
        })
        this.getUserName()
    }


    getUserName = () => {
        let id = parseInt(this.state.userId)
        this.setState({ userName: this.state.users[id-1].username })
    }

    fetchStatus = () => {
        let statusArray = []
        this.state.users.map(user => {
            statusArray.push(user.company.catchPhrase)
        })
        // console.log(statusArray)
        if (localStorage.getItem("allStatus") === null) {
            localStorage.setItem("allStatus", statusArray)
        }
    }

    // fetchFriends = async () => {
    //     const returned = await fetch(
    //         'https://jsonplaceholder.typicode.com/users'
    //     );
    //     const items = await returned.json()
    //
    //     this.getUserFriendIds()
    //     let userFriends = this.state.users.map((user) => {
    //         if (user.id === this.state.friendsList[0] || user.id === this.state.friendsList[1] || user.id === this.state.friendsList[2]) {
    //             return user
    //         }
    //     })
    //     let updatedUserFriends = []
    //     for (let i = 0; i < userFriends.length; i++) {
    //         if (userFriends[i] != null) {
    //             updatedUserFriends.push(userFriends[i])
    //         }
    //     }
    //
    //     this.setState({ friends: updatedUserFriends })
    //
    // }


    fetchPosts = async () => {
        const returned = await fetch(
            'https://jsonplaceholder.typicode.com/posts'
        );
        const items = await returned.json()
        this.setState({ posts: items })
        let newPosts = this.state.posts

        newPosts.map(newPost => {
            newPost["timeStamp"] = this.state.timeStamp
        })

        this.setState({ posts: newPosts })
        this.getUserPosts()
    }

    getUserPosts = () => {
        let tempArray = []
        this.state.posts.map(post => {
            if (post.userId == this.state.userId) {
                tempArray.push({
                        userId: post.userId,
                        timeStamp: post.timeStamp,
                        body: post.body
                    }
                )
            }
        })
        this.setState({ userPosts: tempArray }, () => {
            this.setState({filteredPosts: this.state.userPosts})
        })
    }


    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    addFriend = () => {
        let tempArray = this.state.friends

        this.state.users.map(n => {
            if (this.state.newFriendName === n.username) {
                let newFriend = {
                    company: { catchPhrase: n.company.catchPhrase },
                    username: this.state.newFriendName,
                    id: n.id
                }
                if (newFriend.username != "") {
                    tempArray.push(newFriend)
                }
                this.setState({ friends: tempArray })
                this.fetchFriendPosts()
            }
        })
        this.setState({ newFriendName: "" })
    }

    fetchFriendPosts = () => {
        let increasedStamp = this.state.timeStamp + 1
        this.setState({ timeStamp: increasedStamp })
        let tempArray = []
        let friendId
        this.state.friends.map(friend => {
            if (friend.username === this.state.newFriendName) {
                friendId = friend.id
            }
        })

        this.state.posts.map(post => {
            if (post.userId == friendId) {
                tempArray.push({
                        userId: post.userId,
                        timeStamp: increasedStamp,
                        body: post.body,
                        postId: post.id
                    }
                )
            }
        })
        this.setState({ newFriendPosts: tempArray }, () => this.addFriendPosts())
    }

    addFriendPosts = async () => {
        let FriendPostsArray = this.state.newFriendPosts
        let userPostsArray = this.state.userPosts
        let allPostsArray = []
        FriendPostsArray.map(post => {
            allPostsArray.push(post)
        })
        userPostsArray.map(post => {
            allPostsArray.push(post)
        })
        await this.setState({ userPosts: allPostsArray })
        this.state.userPosts.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp))
        this.setState({ filteredPosts: this.state.userPosts })
    }


    removeFriend = async friendId => {
        this.setState({ newFriendName: "" })
        this.setState({ newFriendPosts: "" })
        let friendsArray = this.state.friends
        let idx
        this.state.friends.map((friend, index) => {
            if (friend.id === friendId) {
                idx = index
            }
        })
        friendsArray.splice(idx, 1)
        this.setState({ friends: friendsArray })
        let postsArray = this.state.userPosts
        let toRemove = []
        postsArray.map((post) => {
            if (post.userId === friendId){
                toRemove.push(post.body)
            }
        })
        postsArray = postsArray.filter(post =>
            !toRemove.includes(post.body)
        )
        await this.setState({ userPosts: postsArray })

        this.state.userPosts.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp))
        this.setState({ filteredPosts: this.state.userPosts })
    }


    addPost = () => {
        let increasedStamp = this.state.timeStamp + 1
        this.setState({ timeStamp: increasedStamp }, () => {
            let tempArray = this.state.userPosts
            let newPost = {
                body: this.state.newPost,
                timeStamp: this.state.timeStamp,
                userId: this.state.userId,
                userName: this.state.userName
            }
            tempArray.push(newPost)
            this.setState({ userPosts: tempArray })
            this.state.userPosts.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp))
            this.setState({filteredPosts: this.state.userPosts})
            this.clearPost()

        })
    }

    clearPost = () => {
        this.setState({ newPost: "" })
    }

    handleStatusChange = newStatus => {
        this.setState({ status: newStatus })

    }

    handleSearch = e => {
        this.setState({searchPost: e.target.value}, () => this.filterPost())
    }


    filterPost = () => {
        let filtered = this.state.userPosts.filter(post => {
            return post.body.toLowerCase().includes(this.state.searchPost.toLowerCase())
        })
        this.setState({filteredPosts: filtered})
    }


    render() {
        return (
            <div className = "MainPage">
                <Row md={2}>
                    <Col md={3}>
                        <div>
                            <User username={this.state.users ? this.state.users[this.state.userId - 1].username : ''}
                                  status={this.state.status ? this.state.status : ''}
                                  updateStatus={this.handleStatusChange} />


                            <Card>
                                {this.state.friends.map(friend => (
                                    <div>
                                        <Card>
                                            <Card.Body>
                                                <Card>
                                                    <Card.Img variant="top" src="https://picsum.photos/800/400" />

                                                    <Card.Title>{this.state.friends ? friend.username : ''}</Card.Title>
                                                    <Card.Text>
                                                        {this.state.friends ? friend.company.catchPhrase : ''}
                                                    </Card.Text>
                                                    <button className="btn btn-primary btn-lg ml-3" onClick={() => this.removeFriend(friend.userId)}>Unfollow</button>

                                                </Card>
                                            </Card.Body>

                                        </Card>
                                    </div>
                                ))}

                                <div>
                                    <input
                                        name="newFriendName"
                                        value={this.state.newFriendName}
                                        onChange={this.change}
                                        placeholder="User">
                                    </input>
                                    <Button variant="primary" onClick={this.addFriend}>Add</Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col md={9}>
                        <Card>

                            <Row>
                                    <input type="file" />
                                    <textarea rows="8" type="text" name="newPost" value={this.state.newPost}
                                            onChange={this.change} placeholder="Your post here" />
                            </Row>


                            <Row>
                                <Button variant="primary" onClick={this.clearPost}>Cancel</Button>
                                <Button variant="primary" onClick={this.addPost}>Post</Button>
                            </Row>
                        </Card>

                        <Card>
                            <div>
                                <input type="text" onChange={this.handleSearch} placeholder="search here"/>
                            </div>

                        </Card>

                        <Row md={3}>
                            {
                                this.state.filteredPosts ? this.state.filteredPosts.map(post => (
                                        <Post postText={post.body} />
                                    ))
                                    :
                                    ''
                            }
                        </Row>

                    </Col>
                </Row>

            </div>
        )
    }
}

export default Main
