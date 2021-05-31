import React from 'react';
import {
    Link, Switch, Route
} from "react-router-dom";
import './activities.css';
import Main from './Main';

function Activities_nav(props){
    return (

        <div>
            
           <Link to="/index/questions" className="activities-link" ><div>My Questions ({props.countQ})</div></Link>
           <Link to="/index/answers" className="activities-link" ><div>My Answers ({props.countA})</div></Link>
        </div>
      

    );
}


export default Activities_nav;