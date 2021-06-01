
import React,{useState, useEffect} from 'react';
import Axios from "axios";
import {
    Link, Switch, Route
} from "react-router-dom";
import './activities.css';
import Main from './Main';
import Questions from './Questions';
import Answers from './Answers';


function Activities(){

    const u = localStorage.getItem("email");
    const [questionsClicked, setQuestionsClicked] = useState(true);
    const [countQ, setCountQ] = useState(0);
    const [countA, setCountA] = useState(0);
    const [colorA, setColorA] = useState();
    const [colorQ, setColorQ] = useState();
    const [name, setName] = useState();
    useEffect(() => {
        Axios.get(`http://localhost:8001/question/${u}`, {

            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
             setCountQ(response.data.result.length);
    });
    }, []);
    useEffect(() => {
        Axios.get(`http://localhost:8001/activityanswer/${u}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setCountA(response.data.result.length);
            // console.log(response);
        });
    }, []);

    useEffect(() => {
        Axios.get(`http://localhost:8001/${u}/user`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setName(response.data.fullname);
            // console.log(response.data);
        });
    }, []);

    function handleQuestionClick(){
        setQuestionsClicked(true);
        setColorQ("#404251");
        setColorA("");
    }

    function handleAnswerClick(){
        setQuestionsClicked(false);
        setColorA("#404251");
        setColorQ("");
    }
    return (

        <div className="dash-main">
            <Link className="activities-link" onClick={handleQuestionClick} style={{backgroundColor:colorQ}}>My Questions ({countQ})</Link>
            <Link className="activities-link" onClick={handleAnswerClick} style={{backgroundColor:colorA}}>My Answers ({countA})</Link>
               {questionsClicked===true?<Questions name={name} count={countQ}/>:<Answers name={name} count={countA}/>} 
        </div>
      

    );
}


export default Activities;