import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from "react-router-dom"
import './Landing.css';

export class Registration extends Component {
    state = {
        accountName: "",
        emailAddress: "",
        phoneNumber: "",
        dob: "",
        ageValid: "",
        zipCode: "",
        password: "",
        passwordConfrm: "",
        passwordValid: "",
        userId: 1,
        redirectMain: false
    }

    constructor(props) {
        super(props)
        this.state = {
            accountName: "",
            emailAddress: "",
            phoneNumber: "",
            dob: "",
            ageValid: "",
            zipCode: "",
            password: "",
            passwordConfrm: "",
            passwordValid: "",
            userId: 1,
            redirectMain: false
        }

        this.change = this.change.bind(this)
        this.ageValidation = this.ageValidation.bind(this)
        this.passwordValidation = this.passwordValidation.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.cancelForm = this.cancelForm.bind(this)
    }

    change = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    ageValidation = () => {
        let dob = this.state.dob
        dob = dob.replace(/\D/g, '');
        let birthYear = Number(dob.substring(0, 4));
        let birthMonth = Number(dob.substring(4, 6)) - 1;
        let birthDay = Number(dob.substring(6));
        let current = new Date();
        let currentYear = current.getFullYear();
        let currentMonth = current.getMonth();
        let currentDay = current.getDate();
        let age = currentYear - birthYear;
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            age--;
        }
        let ret = false;
        if (age < 18) {
            this.setState({ ageValid: false })
        } else {
            this.setState({ ageValid: true })
            ret = true;
        }
        return ret;
    }

    passwordValidation = e => {
        let password = document.getElementById("password");
        let passwordConfrm = document.getElementById("passwordConfrm");

        let ret = false;
        if (password.value === passwordConfrm.value) {
            this.setState({ passwordValid: true })
            ret = true;
        } else {
            this.setState({ passwordValid: false })
        }

        return ret;

    }

    cancelForm = () => {
        this.setState({
            accountName: "",
            emailAddress: "",
            phoneNumber: "",
            dob: "",
            ageValid: "",
            zipCode: "",
            password: "",
            passwordConfrm: "",
            passwordValid: ""
        })
        let dobMsg = document.getElementById("dobMsg")
        let passwordMsg = document.getElementById("passwordMsg")
        dobMsg.innerHTML = ""
        passwordMsg.innerHTML = ""
    }


    handleFormSubmit = (e) => {
        e.preventDefault();
    }

    handleSubmit = (e) => {
        let ageValid = this.ageValidation()
        let passwordValid = this.passwordValidation()
        let dobMsg = document.getElementById("dobMsg")
        let passwordMsg = document.getElementById("passwordMsg")
        let validationMsg = document.getElementById("validationMsg")
        let user = document.getElementById("accountName")
        let email = document.getElementById("emailAddress")
        let phone = document.getElementById("phoneNumber")
        let zip = document.getElementById("zipCode")
        let doB = document.getElementById("dob")
        let pwd = document.getElementById("password")
        let valid = true
        if (user.value ==="" || email.value === ""|| phone.value === ""|| zip.value === "" || doB.value === "" || pwd.value === "" ) {
            valid = false
            validationMsg.innerHTML = "please fill in all required fields"
        }

        if (ageValid === false) {

            dobMsg.style = "display: inline"
            dobMsg.innerHTML = "Underage Attempt."
        } else {
            dobMsg.style = "display: None"
        }

        if (passwordValid === false) {
            passwordMsg.style = "display: inline"
            passwordMsg.innerHTML = "password does not match"
        } else {
            passwordMsg.style = "display: None"
        }
        if (ageValid === true && passwordValid === true && valid === true) {
            localStorage.setItem("userId", this.state.userId)
            localStorage.setItem('userValid', true);
            this.setState({ redirectMain: true })
            localStorage.setItem('logined', 't');
            e.preventDefault();
        }

    }


    render() {
        return (
            <div id= "registration" className="registration">
                { this.state.redirectMain && <Redirect to='/Main' push />}
                <form className="registrationForm" onSubmit={e => e.preventDefault()}>

                    <div className="input2">
                        <label>Account Name:</label>
                        <input
                            name="accountName"
                            id = "accountName"
                            placeholder="enter account name"
                            pattern="^[^0-9][a-zA-Z0-9]*$"
                            value={this.state.accountName}
                            onChange={this.change}
                            title="upper or lower case letters and numbers, may not start with a number"
                        />
                    </div>
                    <div className="input2">
                        <label>Email Address:</label>
                        <input
                            name="emailAddress"
                            id = "emailAddress"
                            placeholder="enter email address"
                            value={this.state.emailAddress}
                            type="email"
                            onChange={this.change}
                        />
                    </div>

                    <div className="input2">
                        <label>phone Number:</label>
                        <input
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="enter phone number"
                            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                            value={this.state.phoneNumber}
                            type="tel"
                            onChange={this.change}
                            title="The format should be xxxxxxxxxx"
                        />
                    </div>

                    <div className="input2">
                        <label>Date of Birth:</label>
                        <input
                            name="dob"
                            id="dob"
                            value={this.state.dob}
                            type="date"
                            onChange={this.change}
                        />
                        <span id="dobMsg"></span>
                    </div>

                    <div className="input2">
                        <label>Zipcode:</label>
                        <input
                            name="zipCode"
                            id="zipCode"
                            placeholder="enter zip code"
                            pattern="[0-9]{5}"
                            value={this.state.zipCode}
                            type="text"
                            onChange={this.change}
                            title="should be 5 digits"
                        />
                    </div>

                    <div className="input2">
                        <label>Password:</label>
                        <input
                            name="password"
                            id="password"
                            placeholder="enter password"
                            value={this.state.password}
                            type="password"
                            onChange={this.change}
                        />
                    </div>

                    <div className="input2">
                        <label>re-enter:</label>
                        <input
                            name="passwordConfrm"
                            id="passwordConfrm"
                            placeholder="re-enter password"
                            value={this.state.passwordConfrm}
                            type="password"
                            onChange={this.change}
                            onKeyUp={this.passwordValidation}
                        />
                        <span id="passwordMsg"></span>
                    </div>

                    <div id = "validationMsg"> </div>

                    <div className="button">
                        <button className="register-btn" type = "submit" onClick={this.handleSubmit}>Register</button>
                        <button className="clear-btn" onClick={this.cancelForm}>Clear</button>
                    </div>
                </form>
            </div>
        )
    }
}


export default Registration
