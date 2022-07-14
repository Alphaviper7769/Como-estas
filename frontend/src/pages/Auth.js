import React, { useState } from 'react';
import './Auth.css';

import Card from '../components/utils/Card';

export const Auth = props => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = data;

    const onChangeHandler = e => {

    };
    
    const onSubmitHandler = e => {
        e.preventDefault();
        setData({
            email: '',
            password: ''
        });
    };

    return (
        <div className='auth-container'>
            <Card position="right" elevation="complete" size="medium">
                <h1 className='auth-card-h1'>LOGIN</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='auth-form-div'>
                        
                    </div>
                </form>
            </Card>
        </div>
    );
};