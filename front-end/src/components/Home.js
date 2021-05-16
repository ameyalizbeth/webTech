import React, { useState,useEffect } from "react";
import Select from "react-select";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import TitleSVG from "../TitleSVG";
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./progress.css";
import Axios from "axios";

function Home(props) {

    const [details, setDetails] = useState([]);

    // const user = localStorage.getItem("user");
    const data = localStorage.getItem("user");
    // const sem = props.location.state.sem;
    const semR = localStorage.getItem("sem");
    const token = localStorage.getItem("token");
    var point = 0;
    var total = 0;

    useEffect(() => {
        
        Axios.get(`http://localhost:8001/${data}/sempoints`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })
        .then((response) => {
            setDetails(response.data);
            console.log(response.data)
            // response.json();
        })
    }, []);
     const len = details.length
     console.log(len);

     for (var i=0; i<details.length;i++){
        total = total +details[i].point;
    }
    if(total > 100){
        total = 100
    }

    if (!token || !data) {
        return <Redirect to='/login' />;
    }

    const sem = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
    const percentage = 66;

    return (
        <div className='my-5 container user-select-none overflow-hidden'>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='log-page-title'>
                    <TitleSVG />
                </div>
                <div>
                    <Link to='/home' className='px-3 py-1 no-underline'>
                        Home
                    </Link>
                    <Link to='/profile' className='px-5 py-1 no-underline grey'>
                        Profile
                    </Link>
                    <Link to='/logout' className='btn start-btn px-3'>
                        Logout
                    </Link>
                </div>
            </div>
            <div className='my-5'>
                <div className='dark-blue h5'>Semesters</div>
                <div className='d-flex my-3 sem-cards-container flex-wrap'>
                    {sem.map((semno) => {
                        point = 0;
                        {details.map((item) => {

                            if(semno === item.sem){
                                point = item.point
                            }
                        })}
                        return (
                            <div></div>
                        // <SemCard data={data} semno={semno} point={point} />
                        )
                    })}
                </div>
            </div>

            {/* <div claName='col-xl-3 col-md-4 col-sm-6'>
                    Welcome {data}...!!
                </div>
                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S1");
                        }}
                    >
                        S1
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S2");
                        }}
                    >
                        S2
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S3");
                        }}
                    >
                        S3
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S4");
                        }}
                    >
                        S4
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S5");
                        }}
                    >
                        S5
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S6");
                        }}
                    >
                        S6
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S7");
                        }}
                    >
                        S7
                    </Link>
                </div>

                <div className='col-xl-3 col-md-4 col-sm-6'>
                    <Link
                        to='/activity'
                        onClick={() => {
                            localStorage.setItem("user", data);
                            localStorage.setItem("sem", "S8");
                        }}
                    >
                        S8
                    </Link>
                </div> */}

            <div className='my-5'>
                <div className='dark-blue h5'>Progress</div>
                <div className='row my-3 progress-section'>
                    <div className='card-bg p-3 m-3 col-md-5 d-flex justify-content-center'>
                        <div className=' progress-circle'>
                            <CircularProgressbarWithChildren
                                value={total}
                                styles={buildStyles({
                                    pathColor: "#232E71",
                                    textColor: "#5078FA",
                                    strokeLinecap: "butt",
                                })}
                            >
                                <div className='d-flex flex-column align-items-center chart-content'>
                                    <div className='num'>{total}</div>
                                    <div className='target mb-3'>Achieved</div>
                                    <div className='num num2'>
                                        {100 - total}
                                    </div>
                                    <div className='target text2'>
                                        more to go
                                    </div>
                                </div>
                            </CircularProgressbarWithChildren>
                        </div>
                    </div>
                    <div className='card-bg p-3 m-3 col-md-5'>
                        {details.map((item) =>{
                            return <li className="dark-blue">Semester {item.sem}: {item.point}</li>
                        })}
                        {/* <li>Semester 1: 35</li>
                        <li>Semester 2: 35</li>
                        <li>Semester 3: 35</li>
                        <li>Semester 4: 35</li>
                        <li>Semester 5: 35</li>
                        <li>Semester 6: 35</li>
                        <li>Semester 7: 35</li>
                        <li>Semester 8: 35</li> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
