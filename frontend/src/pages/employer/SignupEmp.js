import React, { useState } from 'react';
import './SignupEmp.css';

export const SignupEmp = props => {
    const onSubmitHandler = e => {
        e.preventDefault();
    };
    
    return (
        <div className='signup-emp-container'>
            <form onSubmit={onSubmitHandler}>
                
            </form>
        </div>
    );
};