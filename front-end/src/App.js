import React, { Component } from "react";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
import "./App.css";
import './cust.css'
import './components/custom.css'
import Home from "./components/Home";
import Login from "./components/auth-pages/Login";
import SignUp from "./components/auth-pages/SignUp";
import Logout from "./components/auth-pages/Logout";
import Profile from "./components/dash-pages/Profile";
import Dash from "./components/dash-pages/Dash";
import Activities from "./components/dash-pages/Activities";
import Explore from "./components/dash-pages/Explore";



class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path={"/logout"} component={Logout} />
                    <Route exact path={"/"} component={Login} />
                    <Route exact path={"/signup"} component={SignUp} />
                   
                   
                    <Route exact path={"/home"} component={Home} />
                    <Route exact path={"/index/Home"}  component={Dash}/>
                    <Route exact path={"/index/Profile"}  component={Profile}/>
                    <Route exact path={"/index/Activities"}  component={Activities}/>
                    <Route exact path={"/index/Explore"}  component={Explore}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
