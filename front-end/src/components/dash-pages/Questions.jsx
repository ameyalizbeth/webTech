import React,{useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import EditQuestionModal from './EditQuestionModal';
import DeleteQuestionModal from './DeleteQuestionModal';
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';


export default function Questions(props){

    const u = localStorage.getItem("email");
    const [details, setDetails] = useState();
    const [qst, setQst] = useState();
    const [qstId, setQstId] = useState();
    const [category, setCategory] = useState();
    const [count, setCount] = useState(0);

    useEffect(() => {
        Axios.get(`http://localhost:8001/question/${u}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.result);
            setCount(response.data.result.length);
            console.log(response);
        });
    }, []);

    // function handleClick(e){
    //     setQst(e);
    // }


    const deleteQuestion = (e) => {
        

        fetch(`http://localhost:8001/question/user`, {
            method: "DELETE",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                questionid:qstId
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

    return(
        <div>
            <div
                    className='modal fade'
                    data-backdrop="false"
                    id='EditQuestionModalCenter'
                    tabindex='-1'
                    role='dialog'
                    aria-labelledby='EditQuestionModalCenterTitle'
                    aria-hidden='true'
                >
                    <div
                        className='modal-dialog modal-dialog-centered'
                        role='document'
                    >
                        <div className='modal-content modal-main'>
                            {qst===undefined?"":<EditQuestionModal question={qst} id={qstId} category={category}/>}
                        </div>
                    </div>
                </div>

                {/* <div
                    className='modal fade'
                    data-backdrop="false"
                    id='deleteQuestionModalCenter'
                    tabindex='-1'
                    role='dialog'
                    aria-labelledby='deleteQuestionModalCenterTitle'
                    aria-hidden='true'
                >
                    <div
                        className='modal-dialog modal-dialog-centered'
                        role='document'
                    >
                        <div className='modal-content modal-main'>
                            {qst===undefined?"":<DeleteQuestionModal question={qst} id={qstId} category={category}/>}
                        </div>
                    </div>
                </div> */}



            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details===undefined?"":details.map((item) => {
                    return(

                    <div className="activities-qst-card">
                        <div className="act-qst-card-in">
                            <div className="qst">{item.question}</div>

                            

                            <div className="dropdown" >
                            <a class="menu-icon dropdown-toggle"  href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            
                            </a>
                            
                            <div class="drop dropdown-menu" id="dropdown" aria-labelledby="dropdownMenuLink" >
                            <button
                                className='btn dr-link dropdown-item'
                                type='button'
                                data-toggle='modal'
                                data-target='#EditQuestionModalCenter'
                                style={{marginRight:40}}
                                onClick={()=>{setQst(item.question); setQstId(item.questionid); setCategory(item.category)}}>
                                    Edit
                                </button>
                                
                                <button
                                className='btn dr-link dropdown-item'
                                type='button'
                                data-toggle='modal'
                                // data-target='#deleteQuestionModalCenter'
                                style={{marginRight:40}}
                                onClick={deleteQuestion}>
                                    Delete
                                </button>
                                
                            </div>
                </div>
                            <div className="qst-name">
                                <div>
                                    
                                    {!(props.src)?<figure className='person-icon'></figure>:
                                                    <img 
                                                        className="person-img" 
                                                        src={`http://localhost:8001/${props.src}`}
                                                    />
                                    }
                                </div>
                                <div>
                                    <div>{props.name}</div>
                                    <div style={{fontSize:10,color:"gray"}}>asked in{" "} 
                                        <span style={{color:"#06F2B0"}}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        {/* <div className="vote-bar">

                    
                    

                        <button
                            type='button'> </button>
                            <div>
                            <Icon icon={arrowUp24Filled} />

                            <span className="vote-count">10</span>
                            
                            
                            <Icon icon={arrowDown24Filled} />
                            </div>
                            
                            
                        </div> */}
                    </div>
                    )   
                })}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}