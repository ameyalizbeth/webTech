import React from 'react';
import {
    Link
} from "react-router-dom";
import './nav.css'

import { Icon, InlineIcon } from '@iconify/react';
import home24Filled from '@iconify/icons-fluent/home-24-filled';
import squareMultiple24Filled from '@iconify/icons-fluent/square-multiple-24-filled';
import colorLine24Filled from '@iconify/icons-fluent/color-line-24-filled';

function Nav(){
    return (
        <div className="nav-main">
            
              	
            <figure className='ask-cet ask-cet-nav'></figure>
              	<ul className="nav-ul">
					<li>
                        <Link to="/index/Home" className="nav-link" >
                        <Icon icon={home24Filled} /><div>Home</div>
                        </Link>
					</li>
					<li >
                        <Link to="/index/Explore" className="nav-link">
                            <Icon icon={squareMultiple24Filled} /><div>Explore</div>
                        </Link>
					</li>
					<li>
                        <Link to="/index/Activities" className="nav-link">
                        <Icon icon={colorLine24Filled} />
                            <div>Activities</div>
                        </Link>
					</li>
                </ul>
        </div>
    );
}


export default Nav;