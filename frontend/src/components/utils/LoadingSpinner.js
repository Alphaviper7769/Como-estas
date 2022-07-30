import React from 'react';
import './LoadingSpinner.css';

import Backdrop from './Backdrop';

const Spinner = props => {
    // four spans for each entity
    return (
        <div className='spinner-div'>
            <div className='spinner-holder'>
                <span id="one"></span>
                <span id="two"></span>
                <span id="three"></span>
                <span id="four"></span>
            </div>
        </div>
    );
}

const LoadingSpinner = props => {
    return (
        <React.Fragment>
            {props.spin && <Backdrop transparent />}
            <Spinner {...props} />
        </React.Fragment>
    );
};

export default LoadingSpinner;