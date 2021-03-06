import React,{useEffect,useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import Activities from './Activities';
import Explore from './Explore'
import './index.css'
import Nav from './Nav';
import Main from './Main';
import TopBar from './TopBar';
import Logout from "../auth-pages/Logout";
import Profile from "../dash-pages/Profile";

function Index(){

    
    

    return (
        
            <div className="index-main">
            
                
                    <TopBar/>
                    <Nav/>
                    <div className="ind-comp">
                    <Switch>
                        <Route exact path="/index/:id" children={<Main/>} />
                    </Switch>
                    </div>
                
            </div>
        
        
    );
}



export default Index;