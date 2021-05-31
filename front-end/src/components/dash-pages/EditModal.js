import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import './modal.css'
// import Axios from "axios";
import Select from "react-select";


function Activity(props) {
    const [activity, setActivity] = useState("");
    const [prize, setPrize] = useState("");
    const [level, setLevel] = useState("");
    const [category, setCategory] = useState("");
    const [access, setAccess] = useState();
    const [message, setMessage] = useState("");
    const [details, setDetails] = useState([]);
    const [point, setPoint] = useState(0);
    const [src,setSrc] = useState(null);
    const u = props.u;

    

    

    function setimage(e){
        // e.preventDefault();
        
        var data =  new FormData();
        const  image=document.querySelector('input[type="file"]').files[0];
        if(image == null){
            alert("Choose an Image");
        }else{

            data.append('data',image);
            fetch(`http://localhost:8001/dp/${u}`,{
                 method:"POST",
                
                 body: data
        
             }).then(r=>r.json()
             ).then(path=>{
                 console.log(path);
                 setSrc('http://localhost:8001/'+path.path);
             })
            .catch(err=>{
                console.log(err)
            });
        }
        
        
        
        
    }

    return (
        <div className='mx-5 my-3'>
            <h5 className='my-3'>Change Profile Picture</h5>
            <form className='form-group'onSubmit={(e)=>{
                       setimage(e)
                   }} encType="multipart/form-data" >
                
                <div class='form-group pt-2'>
                <label className="custom-file-upload">
                    <input  type="file" name="image" id="image"/>
                </label>
                </div>
                <div className='my-2 d-flex justify-content-end align-items-center'>
                    <div>
                        <button
                            type='button'
                            class=' btn ml-auto py-3 px-4'
                            data-dismiss='modal'
                            aria-label='Close'
                            style={{color:"#ffff"}}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button type="submit"
                            className='btn start-btn col-6'
                            
                        >
                            Submit
                        </button>
                        {/* <button
                            className='btn start-btn orange-btn col-6'
                            type='submit'
                        >
                            Submit
                        </button> */}
                    </div>
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
            {/* <div style={{ textAlign: "center" }}>
                {details.map((item) => (
                    <div key={item.id}>
                        <p>{item.activity}</p>
                        <p>{item.sem}</p>
                    <p>{item.prize}</p>
                    <p>{item.level}</p>
                    </div>
                ))}
            </div> */}
        </div>
    );
}

export default Activity;