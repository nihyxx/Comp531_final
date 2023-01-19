import React, { Component } from 'react';
import {Redirect, withRouter} from "react-router-dom"
import './Landing.css';


export class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: "",
            userId: "",
            userName: "",
            password: "",
            userValid: false,
            redirectMain: false
        }
        this.change = this.change.bind(this)
        this.userValidation = this.userValidation.bind(this)
        this.fetchItems()
    }

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.setState({userValid: false})
    }

    userValidation = () => {
        let userValid = false
        let passwordValid = false
        this.state.data.map(n => {
            if (this.state.userName === n.username) {
                userValid = true
                this.setState({userId: n.id}, () => {localStorage.setItem('userId', this.state.userId)})
            }
            if (this.state.password === n.address.street) {
                passwordValid = true
            }
        })

        if(userValid && passwordValid) {
            this.setState({userValid: true}, () => {localStorage.setItem("userValid", this.state.userValid)})
            this.setState({redirectMain: true})
        }
        else {
            alert("Incorrect account name or password")
        }
    }

    fetchItems = async () => {
        const returned = await fetch(
            'https://jsonplaceholder.typicode.com/users'
        );
        const items = await returned.json()
        this.setState({ data: items })
    }

    render() {
        return (
            <div id = "login" className="login">
                {this.state.redirectMain && <Redirect to='/Main' push/>}
                <div className="input">
                    <div>
                        <input
                            name="userName"
                            placeholder="Username"
                            value={this.state.userName}
                            type="text"
                            onChange={this.change}
                            required
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            placeholder="password"
                            value={this.state.password}
                            type="text"
                            onChange={this.change}
                            required
                        />
                    </div>
                </div>
                <div>
                    <button className = "submit-btn" onClick={this.userValidation}>Login</button>
                </div>
            </div>
        )
    }
}

export default Login
