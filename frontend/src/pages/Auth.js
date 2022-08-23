import React, { useState, useContext } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import auth from '../components/config/firebase-config';
import Card from '../components/utils/Card';
import Button from '../components/utils/Button';
import Modal from '../components/utils/Modal';
import { AuthContext } from '../components/context/auth-context';
import { useHttp } from '../components/hooks/http-hook';
import LoadingSpinner from '../components/utils/LoadingSpinner';

export const Auth = props => {
    const navigate = useNavigate();
    const [signup, setSignup] = useState(0);
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = data;
    const authContext = useContext(AuthContext);
    const { loading, httpRequest } = useHttp();

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
    const submitButton = async () => {
        let response;
        try {
            response = await httpRequest(
                `http://localhost:5000/`,
                'POST',
                JSON.stringify({
                    name: '',
                    email: data.email,
                    password: data.password
                }),
                {
                    'Content-Type': 'application/json',
                }
            );
        } catch (err) {
            console.log(err.message);
        }
        console.log(response);
        authContext.login(response.userId, response.admin, response.token);
        setData({
            name: '',
            email: '',
            password: ''
        });
        setShow(false);
        console.log(authContext);
        navigate('/dashboard');
    };

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    const onSubmitHandler = e => {
        e.preventDefault();
        submitButton();
    };

    const onSignIn = async () => {
        let response;
        try {
            response = await httpRequest(
                `http://localhost:5000/signup`,
                'POST',
                JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    employer: signup == 2 ? 1 : 0
                }),
                {
                    'Content-Type': 'application/json'
                }
            );
        } catch (err) {}

        authContext.login(response.userId, response.admin, response.token);
        setData({
            name: '',
            email: '',
            password: ''
        });

        setShow(false);
        setSignup(0);
        navigate('/dashboard');
    };

    const googleHandler = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                const user = res.user;
                console.log(user);
                setData({
                    name: user.displayName,
                    email: user.email,
                    password: user.uid
                });
                signup == 0 ? submitButton() : onSignIn();
            })
            .catch((err) => {
                const code = err.code;
                const message = err.message;
                console.log(code, message);
                if (code === 'auth/account-exists-with-different-credential' && code.customData._tokenResponse.verifiedProvider.length > 0) {
                    setData({
                        name: err.customData.displayName,
                        email: err.customData.email,
                        password: err.customData._tokenResponse.localId
                    });
                    signup == 0 ? submitButton() : onSignIn();
                }
            });
    };

    const facebookHandler = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then((res) => {
                const user = res.user;
                setData({
                    name: user.displayName,
                    email: user.email,
                    password: user.uid
                });
                signup == 0 ? submitButton() : onSignIn();
            })
            .catch((err) => {
                const code = err.code;
                const message = err.message;
                console.log(code, message);
                if (code === 'auth/account-exists-with-different-credential' && code.customData._tokenResponse.verifiedProvider.length > 0) {
                    setData({
                        name: err.customData.displayName,
                        email: err.customData.email,
                        password: err.customData._tokenResponse.localId
                    });
                    signup == 0 ? submitButton() : onSignIn();
                }
            });
    };

    const onClickHandler = () => {
        setSignup(0);
        setShow(true);
    };

    const openSignup = (admin) => {
        // admin = 2 -> EMPLOYER
        // admin = 1 -> EMPLOYEE
        // admin = 0 -> No Signup
        setSignup(admin);
    };

    const onSigninHandler = async (e) => {
        e.preventDefault();
        onSignIn();
    };

    return (
        <>
            <Modal show={show} onCancel={() => setShow(false)} onSubmit={onSigninHandler} header='SIGNUP'>
                {signup == 0 ?
                    <div className='auth-modal-div'>
                        <Button transform='no-transform' onClick={() => openSignup(2)}>{employer}</Button>
                        <Button transform='no-transform' onClick={() => openSignup(1)}>{employee}</Button>
                    </div> : 
                    <div className='signup-container'>
                        <div className='signup-google'>
                            <p>Or SignUp with</p>
                            <div>
                                <Button onClick={googleHandler}>Google</Button>
                                <Button onClick={facebookHandler}>Facebook</Button>
                            </div>
                        </div>
                        <div style={{ width: '0.2rem', height: 'inherit', background: 'black', margin: '0.3rem' }}></div>
                        <hr />
                        <div className='signup-modal-div center'>
                            {/* <form onSubmit={onSigninHandler}> */}
                                <div className='auth-form-div'>
                                    <input id='auth-email' className='auth-form-input' type='text' placeholder=' ' onChange={onChangeHandler} name='name' value={name} required />
                                    <label htmlFor='auth-name' className='auth-form-label' id='auth-email-label'>Name</label>
                                </div>
                                <div className='auth-form-div'>
                                    <input id='auth-email' className='auth-form-input' type='email' placeholder=' ' onChange={onChangeHandler} name='email' value={email} required />
                                    <label htmlFor='auth-email' className='auth-form-label' id='auth-email-label'>Email</label>
                                </div>
                                <div className='auth-form-div'>
                                    <input id='auth-password' className='auth-form-input' type='password' placeholder=' ' onChange={onChangeHandler} name='password' value={password} required />
                                    <label htmlFor='auth-password' className='auth-form-label' id='auth-password-label'>Password</label>
                                </div>
                                <div className='signup-form-button'>
                                    <Button type="submit">SIGN IN</Button>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                }
            </Modal>
            {!loading ? <div className='auth-container'>
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
            </div> : <LoadingSpinner />}
        </>
    );
};