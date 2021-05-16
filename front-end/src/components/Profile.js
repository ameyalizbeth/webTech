import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import TitleSVG from "../TitleSVG";
import { MdPerson } from "react-icons/md";
import "./profile.css";

function Profile(props) {
    const [details, setDetails] = useState([]);
    // const u = props.location.state.username;
    const u = localStorage.getItem("user");

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
                    <TitleSVG />
                </div>
                <div>
                    <Link to='/home' className='px-3 py-1 grey no-underline'>
                        Home
                    </Link>
                    <Link to='/profile' className='px-5 py-1 no-underline'>
                        Profile
                    </Link>
                    <Link to='/logout' className='btn start-btn px-3'>
                        Logout
                    </Link>
                </div>
            </div>

            <div className='my-5'>
                <div className='dark-blue h5'>Profile</div>
                <div className='card-bg py-3 px-5 profile-size'>
                    <div></div>
                    <div className='d-flex align-items-center my-3 mr-3'>
                        <div className='round d-flex justify-content-center align-items-center my-2 mx-3'>
                            <MdPerson size={22} />
                        </div>
                        <div className='dark-blue h4'>{details.username}</div>
                    </div>
                    <hr></hr>

                    <div className='profile-center my-1'>
                    <div className='my-3'>
                            <span className='purple font-500'>Full Name :</span>
                            <span className='profile-form mb-4'>
                                {details.fullname}
                            </span>
                        </div>
                        <div className='my-3'>
                            <span className='purple font-500'>User name :</span>
                            <span className='profile-form mb-4'>
                                {details.username}
                            </span>
                        </div>

                        <div className='my-3'>
                            <span className='purple font-500'>Email :</span>
                            <span className='profile-form mb-4'>
                                {details.email}
                            </span>
                        </div>

                        <div className='my-3'>
                            <span className='purple font-500'>Address :</span>
                            <span className='profile-form mb-4'>
                                {details.address}
                            </span>
                        </div>

                        <div className='my-3'>
                            <span className='purple font-500'>Phone :</span>
                            <span className='profile-form mb-4'>
                                {details.phoneno}
                            </span>
                        </div>
                        <div className='my-3'>
                            <span className='purple font-500'>Current Sem :</span>
                            <span className='profile-form mb-4'>
                                {details.currsem}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='profile-center'>
                <Link to='/home' className='btn start-btn px-3'>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default Profile;
