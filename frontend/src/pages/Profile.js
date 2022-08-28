import React, { useContext, useState, useEffect } from 'react';
import './Profile.css';

import { AiOutlineClose } from 'react-icons/ai';
import Button from '../components/utils/Button';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import { AuthContext } from '../components/context/auth-context';
import { useHttp } from '../components/hooks/http-hook';

export const Profile = () => {
    const auth = useContext(AuthContext);
    const { loading, httpRequest } = useHttp();
    const [data, setData] = useState({
        name: '',
        dob: '',
        about: '',
        sex: '',
        phone: '',
        email: '',
        resume: '',
        skills: [],
        website: '',
        post: ''
    });
    const [edit, setEdit] = useState(true);
    const { name, dob, about, sex, phone, email, resume, skills, website, post } = data;
    const [skill, setSkill] = useState('');

    useEffect(() => {
        async function getProfile() {
            let response;
            try {
                response = await httpRequest(`http://localhost:5000/dashboard/profile/${auth.admin}/${auth.userId}`);
            } catch (err) {}
            setData(response.user);
        }
        getProfile();
    }, []);

    const clearSkill = (skill) => {
        let sk = skills;
        const index = skills.indexOf(skill);
        index > -1 && sk.splice(index);
        setData({ ...data, ['skills']: sk });
        console.log(data);
    };

    const onSkillChangeHandler = (e) => {
        setSkill(e.target.value);
    };

    const updateSkills = () => {
        let sk = skills;
        sk.push(skill);
        setData({ ...data, [skills]: sk });
        setSkill('');
    };

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            auth.admin ? await httpRequest(
                `/dashboard/profile/${auth.admin}/${auth.userId}`,
                'PATCH',
                JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    website: website 
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            ) : await httpRequest(
                `/dashboard/profile/${auth.admin}/${auth.userId}`,
                'PATCH',
                JSON.stringify({
                    name: name,
                    dob: dob,
                    sex: sex,
                    phone: phone,
                    about: about,
                    post: post,
                    email: email,
                    resume: resume
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}

        setData({
            name: '',
            dob: '',
            about: '',
            sex: '',
            phone: '',
            email: '',
            resume: '',
            skills: [],
            website: '',
            post: ''
        });
    };
    return (
        <>
            {!loading && <div className='profile-container'>
                {!auth.admin && <>
                    <div className='profile-form-div'>
                        <label>Skills</label>
                        <div>
                            <input type='text' disabled={edit} name='skill' value={skill} onChange={onSkillChangeHandler} />
                            <Button inverse disabled={edit} onClick={updateSkills}>ADD</Button>
                        </div>
                    </div>
                    <div className='profile-skills'>
                        {skills.map((s) => {
                            return <section className='profile-skill-section'>{s}<span /><section style={{ cursor: 'pointer', color: 'black' }} onClick={() => clearSkill(s)}><AiOutlineClose /></section></section>;
                        })}
                    </div>
                </>}
                <form onSubmit={onSubmitHandler}>
                    <div className='profile-form-div'>
                        <label>Name</label>
                        <input type='text' disabled={edit} name='name' value={name} onChange={onChangeHandler} />
                    </div>
                    <div className='profile-form-div'>
                        <label>Email ID</label>
                        <input type='email' disabled={edit} name='email' value={email} onChange={onChangeHandler} />
                    </div>
                    <div className='profile-form-div'>
                        <label>Phone</label>
                        <input type='text' disabled={edit} name='phone' value={phone} onChange={onChangeHandler} />
                    </div>
                    {!!auth.admin && <div className='profile-form-div'>
                        <label>Website</label>
                        <input type='text' disabled={edit} name='website' value={website} onChange={onChangeHandler} />
                    </div>}
                    {!auth.admin &&
                        <>
                            <div className='profile-form-div'>
                                <label>Post</label>
                                <input type='text' disabled={edit} name='post' value={post} onChange={onChangeHandler} />
                            </div>
                            <div className='profile-form-div'>
                                <label>Sex</label>
                                <input type='text' disabled={edit} name='sex' value={sex} onChange={onChangeHandler} />
                            </div>
                            <div className='profile-form-div'>
                                <label>Date of Birth</label>
                                <input type='date' disabled={edit} name='dob' value={dob} onChange={onChangeHandler} />
                            </div>
                            <div className='profile-form-div'>
                                <label>Resume</label>
                                <div className='resume-info'>
                                    <input type='text' disabled={edit} name='resume' value={resume} onChange={onChangeHandler} />
                                    <p >Upload your Resume to Google Drive and paste the link</p>
                                </div>
                            </div>
                            <div className='profile-form-div'>
                                <label>About Me</label>
                                <textarea disabled={edit} name='about' value={about} onChange={onChangeHandler} />
                            </div>
                            
                        </>
                    }
                    <div className='button-profile'>
                        {!edit && <Button type='submit'>SAVE</Button>}
                    </div>
                </form>
                <Button danger onClick={() => setEdit(!edit)}>{edit ? 'EDIT' : 'BACK'}</Button>
            </div>}
            {loading && <LoadingSpinner />}
        </>
    );
};