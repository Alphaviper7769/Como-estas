import React, { useState } from 'react';
import './Dashboard.css';

import Card from '../../components/utils/Card';
import Button from '../../components/utils/Button';
import Modal from '../../components/utils/Modal';

import { BsTelephone, BsGlobe, BsPencilFill } from 'react-icons/bs';
import { AiOutlineMail, AiOutlineClose } from 'react-icons/ai';

const details = {
    name: 'Credence Engineering Services',
    staff: 200,
    website: 'www.google.com',
    email: 'ces@cesind.in',
    ph: 7259027418,
    no: 6,
    hired: 9
};

const team = [
    {
        name: 'Raj Aryan',
        post: 'Senior HR Manager'
    },
    {
        name: 'Brateek Krishna',
        post: 'Business Analytic'
    },
    {
        name: 'Ritika Prasad',
        post:'Software Developer'
    },
    {
        name: 'Aayush Raturi',
        post: 'Senior Data Analytic'
    }
];

const jobs = [
    {
        post: 'Web Developer',
        vacancies: 10,
        applicants: 9,
        date: '26 June 2022'
    },
    {
        post: 'App Developer',
        vacancies: 10,
        applicants: 9,
        date: '29 September 2021'
    },
    {
        post: 'Blockchain Developer',
        vacancies: 10,
        applicants: 9,
        date: '1 March 2022'
    }
];

export const Dashboard = props => {
    const [show, setShow] = useState(false);
    // state to store all three data depending upon the modal that is opened
    const [chosen, setChosen] = useState({});
    // state to store which modal is opened
    const [modal, setModal] = useState('');

    const onManagePermissionHandler = (team) => { // function to open modal to assign permissions to employees
        setChosen(team);
        console.log(team);
        setModal('TEAM');
        setShow(true);
    };

    const onOpenPostDetail = (job) => { // function to open modal to edit and delete details of a post
        setChosen(job);
        setModal('DETAILS')
        setShow(true);
    };

    const onOpenApplication = (application) => { // function to open modal to show all the applications for a particular opening
        setChosen(application);
        setModal('APPLICATIONS')
        setShow(true);
    };

    return (
        <>
            <Modal show={show} header={modal === 'TEAM' ? chosen.name : chosen.post} onCancel={() => setShow(false)}>

            </Modal>
            <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <h1 className='emp-dashboard-post-h1'>JOBS POSTED</h1>
                        <Button inverse size={`${window.innerWidth > 789 ? 'medium' : 'small'}`} className='emp-dashboard-post-button'>+ New Post</Button>
                    </div>
                    {jobs.map((job, index) => {
                        return (
                            <div className='emp-job-div' key={index}>
                                <div className='emp-job-post'>
                                    <h3>{job.post}</h3>
                                    <section><b>Vacancies: </b>{job.vacancies}</section>
                                    <section><b>Applicants: </b>{job.applicants}</section>
                                    <p><b>Date Posted: </b>{job.date}</p>
                                </div>
                                <div className='emp-job-post-button'>
                                    <span><Button danger size={`${window.innerWidth > 950 ? 'medium' : 'small'}`} onClick={() => onOpenApplication(job)}>Applications</Button></span>
                                    <span><Button size={`${window.innerWidth > 950 ? 'medium' : 'small'}`} onClick={() => onOpenPostDetail(job)}>Details</Button></span>
                                </div>
                            </div>
                        );
                    })}
                </Card>
                <div className='emp-dashboard-right'>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name}</h1>
                        <p className='emp-dashboard-right-p' style={{ width: 'fit-content' }}><section className='emp-dashboard-right-section' style={{ display: 'inline' }}><b style={{ color: 'black' }}>Jobs Posted:</b><span style={{ width: '0.5rem' }} /> {details.no}</section><section className='emp-dashboard-right-section' style={{ display: 'inline' }}><b style={{ color: 'black' }}>Candidates Hired:</b><span style={{ width: '0.5rem' }} /> {details.hired}</section></p>
                        <div className='emp-dashboard-right-details'>
                            <p className='emp-dashboard-right-p'><BsGlobe /> <a href={details.website} className='emp-dashboard-right-a'>{details.website}</a></p>
                            <p className='emp-dashboard-right-p'><AiOutlineMail /> {details.email}</p>
                            <p className='emp-dashboard-right-p'><BsTelephone /> {details.ph}</p>
                        </div>
                    </Card>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <div className='emp-dashboard-right-team-head'>
                            <h1 className='emp-dashboard-right-h1'>TEAM</h1>
                            <span><Button danger size={`${window.innerWidth > 789 ? 'medium' : 'small'}`}>ADD</Button></span>
                        </div>
                        {team.map((t, index) => {
                            return (
                                <div className='team-div' key={index}>
                                    <div className='team-info'>
                                        <p className='team-name'>{t.name}</p>
                                        <p className='team-detail'>{t.post}</p>
                                    </div>
                                    <div className='team-button'>
                                        <Button title="Manage Permissions" size="square" onClick={() => onManagePermissionHandler(t)}><BsPencilFill /></Button>
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