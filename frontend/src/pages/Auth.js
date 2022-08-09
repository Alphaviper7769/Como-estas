import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import auth from '../components/config/firebase-config';
import Card from '../components/utils/Card';
import Button from '../components/utils/Button';
import Modal from '../components/utils/Modal';

export const Auth = props => {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = data;

    const employer = (
        <div className='emp-div'>
            <h2 className='emp-h2'>Are You an Employer?</h2>
            <p className='emp-p'><b>Click here</b> to signup and find the dream team for your company. Simply post job requirements and check those who apply.</p>
        </div>
    );
    const employee = (
        <div className='emp-div'>
            <h2 className='emp-h2'>Are You Looking for Jobs?</h2>
            <p className='emp-p'>Having trouble finding jobs? <b>Click here</b> to Signup and explore the world of new opportunites. Upload your resume and see various possibilites.</p>
        </div>
    );

    // save details in auth-context after http request
    const submitButton = () => {
        setData({
            email: '',
            password: ''
        });
        setShow(false);
        navigate('/signup');
    };

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    const onSubmitHandler = e => {
        e.preventDefault();
        console.log(data);
        submitButton();
    };

    const googleHandler = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                const user = res.user;
                setData({
                    email: user.email,
                    password: user.uid
                });
                submitButton();
            })
            .catch((err) => {
                const code = err.code;
                const message = err.message;
                console.log(code, message);
                if (code === 'auth/account-exists-with-different-credential' && code.customData._tokenResponse.verifiedProvider.length > 0) {
                    setData({
                        email: err.customData.email,
                        password: err.customData._tokenResponse.localId
                    });
                    submitButton();
                }
            });
    };

    const facebookHandler = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                const user = res.user;
                setData({
                    email: user.email,
                    password: user.uid
                });
                submitButton();
            })
            .catch((err) => {
                const code = err.code;
                const message = err.message;
                console.log(code, message);
                if (code === 'auth/account-exists-with-different-credential' && code.customData._tokenResponse.verifiedProvider.length > 0) {
                    setData({
                        email: err.customData.email,
                        password: err.customData._tokenResponse.localId
                    });
                    submitButton();
                }
            });
    };

    const onClickHandler = () => {
        setShow(true);
    };

    const onCancelHandler = () => {
        setShow(false);
    };

    return (
        <>
            <Modal show={show} onCancel={onCancelHandler} >
                <div className='auth-modal-div'>
                    <Button to='/signup' transform='no-transform' onClick={onCancelHandler}>{employer}</Button>
                    <Button to='/signup' transform='no-transform' onClick={onCancelHandler}>{employee}</Button>
                </div>
            </Modal>
            <div className='auth-container'>
                <div className='auth-body-left'>
                    <h1 className='auth-body-left-h1'>Como Estas</h1>
                    <p className='auth-body-left-p'>Perfection lies in Opportunities</p>
                </div>
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
                        <p className='auth-body-p'>or</p>
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