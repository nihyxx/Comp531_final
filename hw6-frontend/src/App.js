import React from 'react'
import Registration from './components/Landing/Registration'
import Login from './components/Landing/Login'
import Landing from './components/Landing/Landing'
import Update from './components/Profile/Update'
import 'bootstrap/dist/css/bootstrap.min.css'
import User from './components/Main/User'
import Main from './components/Main/Main'
import Profile from './components/Profile/Profile'
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom"
import { Col } from 'react-bootstrap'
import { Row } from 'react-bootstrap'



function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route
                path="/"
                exact
                render={props => <Landing {...props} />}
            />
            <PrivateRoute path="/Main" exact component={Main} />
            <PrivateRoute path="/Profile" exact component={Profile} />
          </Switch>
        </div>
      </Router>
  );
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
          if (((localStorage.getItem("userId") || 'nothing') !== '' || false) == true) {
            return <Component {...props} />;
          } else {
            return (
                <Redirect
                    to={{
                      pathname: "/"
                    }}
                />
            );
          }
        }}
    />
);

export default App;




