import React,{ useEffect,useState} from 'react';
import './dash.css';
import {initData} from './data';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";


function Dash(){

    const [details, setDetails] = useState([]);

    useEffect(() => {
        Axios.get(`http://localhost:8001/question`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.questions);
            console.log(details);
        });
    }, []);
    

    return (

        <div className="dash-main">
            <h5>Discover new topics</h5>
            
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details.map((item) => {
                    return(

                    <div className="qst-card">
                        <div className="qst-card-in">
                            <div className="qst">{item.question}</div>
                            <div className="qst-name">
                                <div>
                                    <figure className='person-icon'></figure>
                                </div>
                                <div>
                                    <div>{item.user}</div>
                                    <div style={{fontSize:10,color:"gray"}}>from{" "} 
                                        <span style={{color:"#06F2B0"}}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="qst-ans">
                                {/* {item.desc} */}
                                Answer Goes here
                            </div>
                        </div>
                        <div className="vote-bar">vote bar</div>
                    </div>
                    )

                })}
                </Masonry>
            </ResponsiveMasonry>      
        </div>
    );
}


export default Dash;