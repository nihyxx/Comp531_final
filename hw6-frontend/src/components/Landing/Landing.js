import React, { Component } from 'react'
import './Landing.css';
import Registration from './Registration'
import Login from './Login'
import {Router, Route, browserHistory} from "react-router"

export class Landing extends Component {


    Login = () => {
        let x= document.getElementById("login")
        let y= document.getElementById("registration")
        let z= document.getElementById("btn")
        x.style.left = "30px";
        y.style.left = "750px";
        z.style.left = "175px"

    }

    Register = () => {
        let x= document.getElementById("login")
        let y= document.getElementById("registration")
        let z= document.getElementById("btn")
        x.style.left = "-700px";
        y.style.left = "30px";
        z.style.left = "350px"
    }

    render() {
        return (
            <div className="landing-page">
                <h1 style={{
                    display: "flex",
                    marginTop: '10rem',
                    justifyContent: "center",
                    alignItems: "center"
                }}> Welcome to FolksZone </h1>
                <div className="form-box">
                    <div className="button-box">
                        <div id="btn"></div>
                        <button type = "button" className = "toggle-btn" onClick = {this.Login}>Log In</button>
                        <button type="button" className="toggle-btn" onClick = {this.Register}>Register</button>
                    </div>
                    <div>
                        <Login />
                    </div>
                    <div>
                        <Registration />
                    </div>
                </div>
            </div>
        )
    }

}

export default Landing
