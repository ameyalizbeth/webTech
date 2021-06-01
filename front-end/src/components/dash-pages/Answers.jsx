import React,{useEffect, useState} from 'react';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import './activities.css';
export default function Answers(props){
    const [details, setDetails] = useState();
    const email = localStorage.getItem("email");
    useEffect(() => {
        Axios.get(`http://localhost:8001/activityanswer/${email}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.result);
            // console.log(response);
        });
    }, []);


    return(
        <div className="dash-main">
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details===undefined?"":details.map((item) => {
                    return(

                    <div className="qst-card">
                        <div className="qst-card-in">
                            <div className="qst">{item.question}</div>
                            <div className="qst-name">
                                <div>
                                    <figure className='person-icon'></figure>
                                </div>
                                <div>
                                    <div>{props.name}</div>
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
                        <div className="activities-vote-bar"><img className="vote-icon" src="https://img.icons8.com/plumpy/24/000000/up.png"/>{item.votes}</div>
                    </div>
                    )

                })}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}