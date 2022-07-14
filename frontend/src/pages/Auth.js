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
                        <input id='auth-form-email' type='email' placeholder='' onChange={onChangeHandler} value={email} />
                        <label htmlFor='auth-form-email' className='auth-label'>Email</label>
                    </div>
                </form>
            </Card>
        </div>
    );
};