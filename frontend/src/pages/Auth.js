import React, { useState } from 'react';
import './Auth.css';

import Card from '../components/utils/Card';
import Button from '../components/utils/Button';

export const Auth = props => {
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = data;

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
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
            <Card position="right" elevation="complete" size="medium" bgcolor='white'>
                <h1 className='auth-card-h1'>LOGIN</h1>
                <div className='card-body center'>
                    <form onSubmit={onSubmitHandler}>
                        <div className='auth-form-div'>
                            <input id='auth-email' className='auth-form-input' type='email' placeholder=' ' onChange={onChangeHandler} name='email' value={email} required />
                            <label htmlFor='auth-email' className='auth-form-label' id='auth-email-label'>Email</label>
                        </div>
                        <div className='auth-form-div'>
                            <input id='auth-password' className='auth-form-input' type='password' placeholder=' ' onChange={onChangeHandler} name='password' value={password} required />
                            <label htmlFor='auth-password' className='auth-form-label' id='auth-password-label'>Password</label>
                        </div>
                        <div className='auth-form-button'>
                            <Button type="submit">SIGN IN</Button>
                        </div>
                    </form>
                    <div className='auth-google'>
                        
                    </div>
                </div>
            </Card>
        </div>
    );
};