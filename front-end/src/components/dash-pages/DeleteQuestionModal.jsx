import React, { useState, useEffect } from "react";
import './editquestionmodal.css'
import { Link, Redirect } from "react-router-dom";




export default function DeleteQuestionModal(props) {
    
    const question = props.question;
    const category = props.category;
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");


    const deleteQuestion = (e) => {
        
       
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8001/question/user`, {
            method: "DELETE",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                questionid:props.id
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Question deleted successfully");
                } else if (r.status == 422) alert("Invalid File format");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));

    };
    if (!token) {
        return <Redirect to='/login' />;
    }

    return (
        <div className=' mx-5 my-3'>
            <h5 className=' my-3'>Are you sure?</h5>
            <form className='form-group'>
                <div class='form-group'>
                   
                    <textarea
                        className='form-control my-3'
                        type='text'
                        placeholder="Ask a question"
                        name='question'
                        id="qst-delete"
                        defaultValue={props.question}
                        disabled="true"
                    ></textarea>
                </div>
                
                <div className='my-2 d-flex justify-content-end align-items-center'>
                    <div>
                        <button
                            type='button'
                            class=' btn ml-auto py-3 px-4'
                            data-dismiss='modal'
                            aria-label='Close'
                            style={{color:"#fff"}}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            className='btn start-btn col-6'
                            onClick={deleteQuestion}
                            type="submit"
                        >
                            Delete Question
                        </button>
                
                    </div>
                </div>
                <p
                    style={{
                        color: "red",
                        fontSize: 12,
                        textAlign: "center",
                    }}
                >
                </p>
            </form>
        </div>
    );
}