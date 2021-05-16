import React, { Component } from "react";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
import "./App.css";
import './cust.css'
import './components/custom.css'
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import Dash from "./components/Dash";

// import Checkout from './components/Checkout';
// import Products from './components/Products'
// import Confirmation from './components/Confirmation';
// import Profile from './components/Profile';
// import Payment from './components/Payment';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {/* <Route exact path='/' component={UserOnboarding} /> */}
                    <Route exact path='/' component={Login} />
                    <Route path='/signup' component={SignUp} />
                    <Route path='/dash' component={Dash} />
                    <Route path='/home' component={Home} />
                    <Route path='/profile' component={Profile} />
                    <Route path='/logout' component={Logout} />
                </Switch>
            </BrowserRouter>

            // <Home/>
        );
    }
}

export default App;
