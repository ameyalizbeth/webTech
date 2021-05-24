import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import "./profile.css";
import "./index.css";

function Profile(props) {
    const [details, setDetails] = useState([]);
    // const u = props.location.state.username;
    const u = localStorage.getItem("email");

    useEffect(() => {
        Axios.get(`http://localhost:8001/${u}/user`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data);
            console.log(response.data);
        });
    }, []);

    return (
        
        <div className='my-5 container user-select-none overflow-hidden'>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='log-page-title'>
                    {/* <TitleSVG /> */}
                </div>
                
            </div>

            <div className='my-5'>
                <div className=' h5'>Profile</div>
                <div className='card-bg py-3 px-5 profile-size'>
                    <div></div>
                    <div className='d-flex align-items-center my-3 mr-3'>
                        <div className='round d-flex justify-content-center align-items-center my-2 mx-3'>
                            <MdPerson size={22} />
                        </div>
                        <div className='h4'>{details.fullname}</div>
                    </div>
                    <hr></hr>

                    <div className='profile-center my-1'>
                    <div className='my-3'>
                            <span className=' font-500'>Full Name :</span>
                            <span className=' mb-4'>
                                {details.fullname}
                            </span>
                        </div>
                       
                        <div className='my-3'>
                            <span className=' font-500'>Email :</span>
                            <span className=' mb-4'>
                                {details.email}
                            </span>
                        </div>
                        <div className='my-3'>
                            <span className='font-500'>Department :</span>
                            <span className=' mb-4'>
                                {details.department}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
        
    );
}

export default Profile;
