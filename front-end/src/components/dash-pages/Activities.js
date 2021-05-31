
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
    useEffect(() => {
        Axios.get(`http://localhost:8001/question/${u}`, {

            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
             setCountQ(response.data.result.length);
    });
    }, []);

    function handleQuestionClick(){
        setQuestionsClicked(true);
        setColorQ("#ffffff61");
        setColorA("");
    }

    function handleAnswerClick(){
        setQuestionsClicked(false);
        setColorA("#ffffff61");
        setColorQ("");
    }
    return (

        <div className="dash-main">
            <Link className="activities-link" onClick={handleQuestionClick} style={{backgroundColor:colorQ}}>My Questions</Link>
            <Link className="activities-link" onClick={handleAnswerClick} style={{backgroundColor:colorA}}>My Answers</Link>
               {questionsClicked===true?<Questions/>:<Answers/>}  
            {/* <Activities_nav countQ={countQ} countA={countA}/> */}
        </div>
      

    );
}


export default Activities;