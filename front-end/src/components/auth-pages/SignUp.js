import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import Select from "react-select";

const cursem = [
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
    { value: "S4", label: "S4" },
    { value: "S5", label: "S5" },
    { value: "S6", label: "S6" },
    { value: "S7", label: "S7" },
    { value: "S8", label: "S8" },
    
];

function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [access, setAccess] = useState();
    const [message, setMessage] = useState("");
    const [currsem, setCurrsem] = useState("");

    const register = (e) => {
        e.preventDefault();

        Axios.post("http://localhost:8001/signup", {
            username: username,
            fullname:fullname,
            password: password,
            email: email,
            phoneno: phone,
            address: address,
            currsem:currsem.value
        }).then((response) => {
            if (response.data.auth) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", username);
                setAccess(true);
            } else {
                setAccess(false);
                setMessage(response.data);
            }
        });
    };
    if (access) {
        return (
            <Redirect
                to='/dash'
            />
        );
    }

    return (
        <div className='log-page user-select-none overflow-hidden min-vh-100 log-bg'>
            {/* <div className='mx-auto m-5 log-page-title'>
                <TitleSVG />
            </div> */}
            <figure className='dot-top'></figure>
            <figure className='dot-right'></figure>
            <figure className='dot-left'></figure>
            <figure className='dot-bottom'></figure>
            <figure className='ppl-bottom'></figure>
            <div className='row px-md-5'>
                <div className='col-12 col-md-6 order-md-2 my-5 px-xl-5'>
                    <div className='d-flex justify-content-center mx-auto w-75'>
                    <div className='dark-blue-text'>
                            <Link to='/' draggable='false'>
                                Sign in
                            </Link>
                        </div>
                        <div className='dark-blue-text-active'>Sign Up</div>
                       
                    </div>
                    <div className='mx-auto py-4 log-box-main'>
                        {/* <div className='log-title'>
                    <Link
                        to='/'
                        style={{ color: "#fff", textDecoration: "none" }}
                    >
                        <b>LogIn</b>
                    </Link>
                </div>
                <div
                    className='sign-title'
                    style={{ backgroundColor: "#fff", color: "#D92027" }}
                >
                    <b>SignUp</b>
                </div> */}
                        <form
                            className='mx-auto form-group col-10'
                            onSubmit={register}
                        >
                            <div className='py-4'>
                                <input
                                    className='form-control px-3 mb-4'
                                    type='email'
                                    placeholder='Email'
                                    name='email'
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    required
                                ></input>
                                <input
                                    className='form-control my-4 px-3 mb-4'
                                    type='text'
                                    placeholder='Full Name'
                                    name='fullname'
                                    onChange={(e) => {
                                        setFullname(e.target.value);
                                    }}
                                    required
                                ></input>
                                <input
                                    className='form-control px-3 my-4'
                                    type='text'
                                    placeholder='Username'
                                    name='name'
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                    required
                                ></input>
                                <input
                                    className='form-control px-3 my-4'
                                    type='password'
                                    placeholder='Password'
                                    name='password'
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                ></input >
                                <Select
                                    className="my-4"
                                    defaultValue={currsem}
                                    onChange={setCurrsem}
                                    options={cursem}
                                />
                                <input
                                    className='form-control px-3 my-4'
                                    type='text'
                                    placeholder='Address'
                                    name='address'
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                    }}
                                    required
                                ></input>
                                <input
                                    className='form-control px-3 mt-4 mx-auto'
                                    type='tel'
                                    placeholder='Mobile Number'
                                    name='phone'
                                    pattern='[5-9][0-9]{9}'
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                    }}
                                    required
                                ></input>
                            </div>
                            <div className='my-2'>
                                <button
                                    className='btn mx-auto start-btn d-block col-6'
                                    type="submit"
                                >
                                    Create account
                                </button>
                            </div>
                            <p
                                style={{
                                    color: "red",
                                    fontSize: 12,
                                    textAlign: "center",
                                }}
                            >
                                {message}
                            </p>
                        </form>
                    </div>
                    <div className='text-center m-4 onboarding-desc'>
                        Already have an account?&nbsp;
                        <Link to='/' draggable='false' style={{color:"#06F2B0"}}>
                            Log in
                        </Link>
                    </div>
                </div>
                <div className='col-12 col-md-6 order-sm-1'>
                    {/* <figure className='login-data-rafiki'></figure> */}
                    <div className="log-title">
                        <figure className='ask-cet'></figure>
                        <p>
                            Ask anything and everything to find the best answers to your<br/>
                            never ending doubts regarding our prestigious college. ;)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
