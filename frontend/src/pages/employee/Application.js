import React, { useState, useEffect, useContext } from 'react';
import './Application.css';

import { BsGlobe, BsTelephone } from 'react-icons/bs';
import { AiOutlineMail } from 'react-icons/ai';
import { AuthContext } from '../../components/context/auth-context';
import { useHttp } from '../../components/hooks/http-hook';
import LoadingSpinner from '../../components/utils/LoadingSpinner';
import Button from '../../components/utils/Button';
import { useNavigate } from 'react-router-dom';

export const Application = () => {
    const navigate = useNavigate();
    // data about post
    const [post, setPost] = useState({
        name: '',
        vacancy: '',
        experience: '',
        location: '',
        salary: '',
        skills: [],
        questions: [],
        eligibility: []
    });
    const [company, setCompany] = useState({
        name: '',
        website: '',
        phone: '',
        email: ''
    });
    // store answers
    const [answer, setAnswer] = useState({});
    const [answers, setAnswers] = useState([]);
    // initialise auth and http hooks
    const auth = useContext(AuthContext);
    const { loading, httpRequest } = useHttp();
    useEffect(() => {
        async function getPost() {
            // get postID from URL
            const postID = window.location.href.split('/')[5];
            let response;
            try {
                response = await httpRequest(`http://localhost:5000/dashboard/post/${postID}`);
            } catch (err) {}
            setPost(response.post);
            setCompany(response.company);
        }
        getPost();
    }, []);

    const onChangeHandler = e => {
        // let temp = answer;
        // temp[parseInt(e.target.name - '0')] = temp[parseInt(e.target.name - '0')] + e.target.value;
        setAnswer({ ...answer, [parseInt(e.target.name)]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        for(let i=0;i<post.questions.length;i++) {
            let temp = answers;
            temp[i] = answer[i];
            setAnswers(temp);
        }
        console.log(answer);
        let response;
        try {
            response = await httpRequest(
                `http://localhost:5000/dashboard/apply`,
                'POST',
                JSON.stringify({
                    userID: auth.userId,
                    postID: window.location.href.split('/')[5],
                    answers: answers,
                    date: new Date().toISOString()
                }), 
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}
        console.log(response);
        navigate('/dashboard');
    };
    return (
        <>
            {!loading ? 
                <div className="application-container">
                    <div className='application-info'>
                        <div className='application-info-company'>
                            <img src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg' alt='logo' />
                            <div>
                                <h1>{company.name || '---'}</h1>
                                <p><BsGlobe /><span style={{ width: '1rem' }}></span> {company.website || '---'}</p>
                                <p><BsTelephone /><span style={{ width: '1rem' }}></span> {company.phone || '---'}</p>
                                <p><AiOutlineMail /><span style={{ width: '1rem' }}></span> {company.email || '---' }</p>
                            </div>
                        </div>
                        <div className='application-info-post'>
                            <h2 style={{ 'text-decoration': 'underline', color: 'blue', paddingLeft: '3rem' }}><b>{post.name}</b></h2>
                            <div className='application-info-post-div'>
                                <p><b>Vacancies: </b>{post.vacancy || '---'}</p>
                                <p><b>Experience: </b>{post.experience || '---'}</p>
                            </div>
                            <div className='application-info-post-div'>
                                <p><b>Salary: </b>{post.salary || '---'} <span style={{ color: 'blue' }}>PA</span></p>
                                <p><b>Location: </b>{post.location || '---'}</p>
                            </div>
                            <div className='application-info-post-div'>
                                <p><b>Skills: </b>{post.skills.length > 0 && post.skills.map((skill) => {
                                    return <secton style={{ color: 'red' }}>{skill}, </secton>;
                                })}</p>
                            </div>
                            <div className='application-info-eligibility'>
                                <p><b>Eligibility Criteria</b></p>
                                <ul>
                                    {post.eligibility.length > 0 && post.eligibility.map(eligible => {
                                        return <li>{eligible}</li>;
                                    })}
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div className='application-vr'></div>
                    <hr />
                    <div className='application-answers'>
                        <form onSubmit={onSubmitHandler}>
                            {post.questions.map((question, index) => {
                                return (
                                    <div className='questions-div'>
                                        <p>{question}</p>
                                        <textarea name={index} value={answer[index] || ''} onChange={onChangeHandler} />
                                    </div>
                                );
                            })} 
                            <Button type='submit'>SUBMIT</Button>
                        </form>
                    </div>
                </div> : <LoadingSpinner />
            }
        </>
    );
};