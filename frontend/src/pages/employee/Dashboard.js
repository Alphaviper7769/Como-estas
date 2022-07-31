import React, { useState } from 'react';
import './Dashboard.css';

import Card from '../../components/utils/Card';
import Button from '../../components/utils/Button';
import Modal from '../../components/utils/Modal';

import { AiOutlineClose } from 'react-icons/ai';
import { BsPencilFill } from 'react-icons/bs';

const jobs = [
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        Salary: 'Rs 10000/Month'
    },
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        Salary: 'Rs 10000/Month'
    },
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        Salary: 'Rs 10000/Month'
    }
];

const details = {
    name: 'Raj Aryan',
    dob: '18 June 2002',
    phone: 7259027418,
    resume: 'www.google.com',
    email: '18raj06@gmail.com',
    gender: 'Male',
    skills: ['Javascript', 'ReactJS', 'CSS', 'AWS']
};

const applied = [
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        date: '22 July 2002'
    }
];

export const SeekerDashboard = props => {
    const [show, setShow] = useState(false);
    // state to store all three data depending upon the modal that is opened
    const [chosen, setChosen] = useState({});
    // state to store which modal is opened
    const [modal, setModal] = useState('');

    const onManageApplicationHandler = (team) => { // function to open modal to assign permissions to employees
        setChosen(team);
        console.log(team);
        setModal('APPLICATION');
        setShow(true);
    };

    const onOpenApply = (application) => { // function to open modal to show all the applications for a particular opening
        setChosen(application);
        setModal('APPLY')
        setShow(true);
    };

    return (
        <>
            <Modal show={show} header={modal === 'TEAM' ? chosen.name : chosen.post} onCancel={() => setShow(false)}>

            </Modal>
            <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <h1 className='emp-dashboard-post-h1'></h1>
                    </div>
                    {jobs.map((job, index) => {
                        return (
                            <div className='emp-job-div' key={index}>
                                <div className='emp-job-post'>
                                    <h3>{job.post}</h3>
                                </div>
                                <div className='emp-job-post-button'>
                                    <Button danger onClick={() => onOpenApply(job)}>Appy</Button>
                                </div>
                            </div>
                        );
                    })}
                </Card>
                <div className='emp-dashboard-right'>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name}</h1>
                        <p className='emp-dashboard-right-p'><b style={{ color: 'black' }}>Email ID:</b> {details.email}</p>
                        <p className='emp-dashboard-right-p'><b style={{ color: 'black' }}>Phone:</b> {details.phone}</p>
                        <p className='emp-dashboard-right-p'><b style={{ color: 'black' }}>Date of Birth:</b> {details.dob}</p>
                        <p className='emp-dashboard-right-p'><b style={{ color: 'black' }}>Gender:</b> {details.gender}</p>
                        {/* <div className='emp-dashboard-right-details'>
                            <p className='emp-dashboard-right-p'><a href={details.website} className='emp-dashboard-right-a'></a></p>
                            <p className='emp-dashboard-right-p'></p>
                            <p className='emp-dashboard-right-p'></p>
                        </div> */}
                        <p className='emp-dashboard-right-p'>
                            <section className='emp-dashboard-right-section'><b style={{ color: 'black' }}>Skills: </b> {details.skills.map((skill) => { return <section className="seeker-profile-skill">{skill}<span></span></section>; })}</section>
                        </p>
                    </Card>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <div className='emp-dashboard-right-team-head'>
                            <h1 className='emp-dashboard-right-h1'>Applied</h1>
                        </div>
                        {applied.map((t, index) => {
                            return (
                                <div className='team-div' key={index}>
                                    <div className='team-info'>
                                        <p className='team-name' id='applied-name'>{t.post}</p>
                                        <p className='applied-detail'>{t.company}</p>
                                        <p className='applied-detail'>Applied on {t.date}</p>
                                    </div>
                                    <div className='applied-button'>
                                        <Button title="Manage Permissions" size="square" onClick={() => onManageApplicationHandler(t)}><BsPencilFill /></Button>
                                        <Button transform='cross'><AiOutlineClose /></Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Card>
                </div>
            </div>
        </>
    );
};