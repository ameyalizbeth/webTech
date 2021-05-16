import React from 'react';
import { Link } from "react-router-dom";

function Dash(){
    return (
        <div className="dash-main">
            Shit Goes here
            <Link to='/logout' className='btn start-btn px-3'>
                        Logout
            </Link>
        </div>
    );
}


export default Dash;