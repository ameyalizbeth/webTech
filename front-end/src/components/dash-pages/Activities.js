
import React,{useState, useEffect} from 'react';
import Axios from "axios";
import {
    Link, Switch, Route
} from "react-router-dom";
import './activities.css';
import Main from './Main';
import Activities_nav from './Activities_nav';
function Activities(){

    const u = localStorage.getItem("email");
    const [countQ, setCountQ] = useState(0);
    const [countA, setCountA] = useState(0);
    useEffect(() => {
        Axios.get(`http://localhost:8001/question/${u}`, {

            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
             setCountQ(response.data.result.length);
    });
    }, []);



    return (

        <div className="dash-main">
                   
            <Activities_nav countQ={countQ} countA={countA}/>
        </div>
      

    );
}


export default Activities;