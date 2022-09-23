import React, { useState, useContext } from 'react';
import './NewPost.css';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/context/auth-context';
import { useHttp } from '../../components/hooks/http-hook';
import LoadingSpinner from '../../components/utils/LoadingSpinner';
import Button from '../../components/utils/Button';

export const NewPost = props => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        vacancy: 0,
        dueDate: '',
        salary: 0,
        location: '',
        experience: 0,
        skills: '',
        eligibility: '',
        questions: ''
    });
    const { name, vacancy, dueDate, salary, location, experience, skills, eligibility, questions } = data;
    const { loading, httpRequest } = useHttp();
    const auth = useContext(AuthContext);
    
    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        let response;
        try {
            response = await httpRequest(
                'http://localhost:5000/dashboard/post',
                'POST',
                JSON.stringify({
                    name: name,
                    vacancy: vacancy,
                    date: new Date().toISOString(),
                    companyID: auth.userId,
                    skills: skills.split(','),
                    eligibility: eligibility.split(','),
                    questions: questions.split(','),
                    dueDate: dueDate,
                    salary: salary,
                    location: location ? location : 'Anywhere',
                    experience: experience,
                    userID: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}
        setData({
            name: '',
            vacancy: 0,
            dueDate: '',
            salary: 0,
            location: '',
            experience: 0,
            skills: '',
            eligibility: '',
            questions: ''
        });
        navigate('/dashboard');
    };
    return (
        <div className='newpost-container'>
            <h1>New Post</h1>
            {!loading && <form onSubmit={onSubmitHandler}>
                <div className='team-modal-div'>
                    <label htmlFor='name'>Position: </label>
                    <input type="text" name="name" value={name} onChange={onChangeHandler} required />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='vacancy'>Vacancies: </label>
                    <input type="number" name="vacancy" value={vacancy} onChange={onChangeHandler} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='dueDate'>Due Date: </label>
                    <input type="date" name="dueDate" value={dueDate} onChange={onChangeHandler} required />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='salary'>Salary: </label>
                    <input type="number" name="salary" value={salary} onChange={onChangeHandler} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='location'>Location: </label>
                    <input type="text" name="location" value={location} onChange={onChangeHandler} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='experience'>Experience: </label>
                    <input type="number" name="experience" value={experience} onChange={onChangeHandler} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='skills'>Skills Required: </label>
                    <input type="text" name="skills" value={skills} onChange={onChangeHandler} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='eligibility'>Eligibility: </label>
                    <textarea name="eligibility" value={eligibility} onChange={onChangeHandler} placeholder='Enter comma seperated Eligibility Criteria. Eg. BTech in CS,18 Years' />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='questions'>Questions: </label>
                    <textarea name="questions" value={questions} onChange={onChangeHandler} placeholder='Enter comma seperated Questions. Add question marks if required. Eg. Why do you want this job?,Where do you see yourself in 5 years?' />
                </div>
                <div className='new-post-buttons'>
                    <Button danger to='/dashboard'>Back</Button>
                    <Button type='submit'>SUBMIT</Button>
                </div>
            </form>}
            {loading && <LoadingSpinner />}
        </div>
    );
};