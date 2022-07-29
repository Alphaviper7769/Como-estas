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

export const Dashboard = props => {
    const [show, setShow] = useState(false);
    const [chosen, setChosen] = useState({
        name: '',
        post: '',
        permissions: []
    });

    const onClickHandler = t => {
        setChosen({
            name: t.name,
            post: t.post
        });
        console.log(t);
        setShow(true);
    };

    return (
        <>
            <Modal show={show} header={chosen.name} onCancel={() => setShow(false)}>

            </Modal>
            <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <h1 className='emp-dashboard-post-h1'>JOBS POSTED</h1>
                        <Button inverse size='medium' className='emp-dashboard-post-button'>+ New Post</Button>
                    </div>
                </Card>
                <div className='emp-dashboard-right'>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name}</h1>
                        <p className='emp-dashboard-right-p'><section className='emp-dashboard-right-section'><b style={{ color: 'black' }}>Jobs Posted:</b> {details.no}</section><section className='emp-dashboard-right-section'><b style={{ color: 'black' }}>Candidates Hired:</b> {details.hired}</section></p>
                        <div className='emp-dashboard-right-details'>
                            <p className='emp-dashboard-right-p'><BsGlobe /> <a href={details.website} className='emp-dashboard-right-a'>{details.website}</a></p>
                            <p className='emp-dashboard-right-p'><AiOutlineMail /> {details.email}</p>
                            <p className='emp-dashboard-right-p'><BsTelephone /> {details.ph}</p>
                        </div>
                    </Card>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>TEAM</h1>
                        {team.map((t, index) => {
                            return (
                                <div className='team-div' key={index}>
                                    <div className='team-info'>
                                        <p className='team-name'>{t.name}</p>
                                        <p className='team-detail'>{t.post}</p>
                                    </div>
                                    <div className='team-button'>
                                        <Button key={index} title="Manage Permissions" size="square" onClick={() => onClickHandler(t)}><BsPencilFill /></Button>
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