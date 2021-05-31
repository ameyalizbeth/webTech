import React,{ useEffect,useState}from 'react';
import Axios from "axios";

function Activities(){
    useEffect(() => {
        Axios.get(`http://localhost:8001/activityanswer/ameya123@cet.ac.in`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
             console.log(response.data);
        });
    }, []);
    return (

        <div className="dash-main">
           activities page   
        </div>
      

    );
}


export default Activities;