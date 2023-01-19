import React, { Component } from 'react'
import {Redirect} from "react-router-dom"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newStatus: "",
            redirectLogin: false,
            redirectProfile: false
        }
        this.updateStatus = this.updateStatus.bind(this)
    }

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    updateStatus = () => {
        this.props.updateStatus(this.state.newStatus)
        this.setState({newStatus: ""})
    }

    handleLogout = () => {
        localStorage.setItem("userId", "")
        localStorage.setItem("userValid", "")
        this.setState({redirectLogin: true})
        localStorage.setItem("redirectMainRegist", false)
    }

    handleProfile = () => {
        this.setState({redirectProfile: true})

    }

    render() {
        return (
            <div>
                {this.state.redirectLogin && <Redirect to='/' push/>}
                {this.state.redirectProfile && <Redirect to='/Profile' push/>}
                <Card>
                    <div>

                        <button className="btn btn-primary btn-lg ml-3" onClick={this.handleLogout}>Log out</button>
                        <button className="btn btn-primary btn-lg ml-5" onClick={this.handleProfile}>Profile</button>

                    </div>

                    <Card.Img variant="top" src="https://picsum.photos/800/500" />
                    <Card.Body>
                        <Card.Title>{this.props.username}</Card.Title>
                         {/*<div> {console.log(this.props)}</div>*/}
                        <Card.Text>
                            {this.props.status}
                        </Card.Text>
                        <div>
                            <input
                                value={this.state.newStatus}
                                name="newStatus"
                                onChange={this.change}
                                placeholder="New Status"></input>
                            <Button variant="primary"
                                    onClick={this.updateStatus}>Update</Button>
                        </div>
                    </Card.Body>
                </Card>


            </div>
        )
    }
}

export default User
