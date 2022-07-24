import React, { useState } from 'react';
import './Auth.css';

import Card from '../components/utils/Card';
import Button from '../components/utils/Button';
import Modal from '../components/utils/Modal';

export const Auth = props => {
    const [show, setShow] = useState(false);
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

    const googleHandler = () => {};

    const facebookHandler = () => {};

    const onClickHandler = () => {
        setShow(true);
    };

    const onCancelHandler = () => {
        setShow(false);
    };

    return (
        <>
            <Modal show={show} onCancel={onCancelHandler} footer={<Button onClick={onCancelHandler}>CLOSE</Button>} >
                <div className='auth-modal-div'>
                    <Button transform='no-transform' onClick={onCancelHandler}>Are You an Employer?</Button>
                    <Button transform='no-transform' onClick={onCancelHandler}>Are you looking for Jobs?</Button>
                </div>
            </Modal>
            <div className='auth-container'>
                <Card elevation="complete" size="medium" bgcolor='white'>
                    <h1 className='auth-card-h1'>LOGIN</h1>
                    <div className='card-body'>
                        <div className='card-body-form center'>
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
                        </div>
                        <hr className='auth-body-hr' />
                        <p className='auth-body-p center'>or</p>
                        <div className='auth-other'>
                            <div className='auth-google'>
                                <Button onClick={googleHandler}>GOOGLE</Button>
                                <Button onClick={facebookHandler}>FACEBOOK</Button>
                            </div>
                        </div>
                        <p className='auth-signup'>Don't have an Account? <button id='signup-button' onClick={onClickHandler}>Sign Up</button></p>
                    </div>
                </Card>
            </div>
        </>
    );
};