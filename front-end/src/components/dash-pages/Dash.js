import React from 'react';
import './dash.css';
import Nav from './Nav';
import "./index.css";
import TopBar from './TopBar';

function Dash(){
    return (
        
        <div className="index-main grid-container">
        <div className="ind-top"><TopBar/></div>
        <div className="ind-nav"><Nav/></div>
        <div className="ind-comp">
        <div className="dash-main">
           Home page   
        </div>
       </div>
       </div>
    );
}


export default Dash;