import React,{ useEffect,useState} from 'react';
import './dash.css';
import {initData} from './data';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';


function Dash(){

    const [details, setDetails] = useState([]);
    const [src,setSrc] = useState(null);

    useEffect(() => {
        Axios.get(`http://localhost:8001/question`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.questions);
            setSrc('http://localhost:8001/'+ response.data.image);
            // console.log(details);
            // console.log(response.data);
        });
    }, []);
    

    return (

        <div className="dash-main">
            <h5>Discover new topics</h5>
            
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details!==undefined?details.map((item) => {
                    if(item.answereduser !== null){
                        return(

                            <div className="qst-card" key={item.questionid}>
                                <div className="qst-card-in">
                                    <div className="qst">{item.question} ?</div>
                                    <div className="qst-name">
                                        <div>
                                            {!(item.answereduser.image)?<figure className='person-icon'></figure>:
                                                (!src?<figure className='person-icon'></figure>:
                                                    <img 
                                                        className="person-img" 
                                                        src={`http://localhost:8001/${item.answereduser.image}`}
                                                    />
                                                )
                                            }
                                            
                                        </div>
                                        <div>
                                            <div>{item.answereduser.fullname}</div>
                                            <div style={{fontSize:10,color:"gray"}}>from{" "} 
                                                <span style={{color:"#06F2B0"}}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="qst-ans">
                                        {item.answer}
                                        
                                    </div>
                                </div>

                                <div className="vote-bar">
                                    <div>
                                    <Icon icon={arrowUp24Filled} />

                                    <span className="vote-count">{item.answervotes}</span>
                                    
                                    
                                    <Icon icon={arrowDown24Filled} />
                                    </div>
                                    <div>
                                        asked by <span style={{color:"#06E6B1",fontSize:12}}>{item.user}</span>
                                    </div>   
                                </div>

                                
                            </div>
                            )
                    }
                    

                }):""}
                </Masonry>
            </ResponsiveMasonry>      
        </div>
    );
}


export default Dash;