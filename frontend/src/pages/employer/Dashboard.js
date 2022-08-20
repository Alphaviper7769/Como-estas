import React, { useState, useContext, useEffect } from 'react';
import './Dashboard.css';

import Card from '../../components/utils/Card';
import Button from '../../components/utils/Button';
import { TeamModal, DeleteModal, ApplicationModal, PostDetailModal } from './EmployerModal';
import { AuthContext } from '../../components/context/auth-context';
import { useHttp } from '../../components/hooks/http-hook';

import { BsTelephone, BsGlobe, BsPencilFill } from 'react-icons/bs';
import { AiOutlineMail, AiOutlineClose } from 'react-icons/ai';
import LoadingSpinner from '../../components/utils/LoadingSpinner';

export const Dashboard = () => {
    const [show, setShow] = useState(false);
    // state to store all three data depending upon the modal that is opened
    const [chosen, setChosen] = useState({});
    // state to store which modal is opened
    const [modal, setModal] = useState('');
    // initialize auth and http hooks
    const auth = useContext(AuthContext);
    const { loading, httpRequest } = useHttp();

    // data states 
    const [details, setDetails] = useState();
    const [jobs, setJobs] = useState([]);
    const [team, setTeam] = useState([]);
    const [post, setPost] = useState([]);

    useEffect(() => {
        async function getCompany() {
            let response;
            try {
                response = await httpRequest(`http://localhost:5000/dashboard/${1}/${auth.userId}`);
            } catch (err) {}
            setDetails(response.user);
            setJobs(response.posts);
            setTeam(response.team);
            setPost(response.permissions);
        }
        getCompany();
    }, [show]);

    const onManagePermissionHandler = (team) => { // function to open modal to assign permissions to employees
        setChosen(team);
        setModal('TEAM');
        setShow(true);
    };

    const onOpenPostDetail = (job) => { // function to open modal to edit and delete details of a post
        setChosen(job);
        setModal('DETAILS')
        setShow(true);
    };

    const onOpenApplication = (job) => { // function to open modal to show all the applications for a particular opening
        setChosen(job);
        setModal('APPLICATIONS')
        setShow(true);
    };

    // call the modal for add employee
    const addEmployee = () => {
        setChosen({
            name: '',
            post: '',
            permission: []
        });
        setModal('TEAM');
        setShow(true);
    };

    // deleteEmployee Modal
    const deleteEmployee = (team) => {
        setChosen(team);
        setModal('DELETE');
        setShow(true);
    };

    return (
        <>
            {show && modal === 'TEAM' && <TeamModal show={show} name={chosen.name} position={chosen.post} permission={chosen.permission} onCancel={() => setShow(false)} disabled={chosen.name.length > 0 ? true : false} posts={post} id={chosen._id} />}
            {show && modal === 'DELETE' && <DeleteModal show={show} name={chosen.name} position={chosen.post} onCancel={() => setShow(false)} action='employee' id={chosen._id} />}
            {show && modal === 'APPLICATIONS' && <ApplicationModal show={show} name={chosen.name} job={chosen} onCancel={() => setShow(false)} />}
            {show && modal === 'DETAILS' && <PostDetailModal show={show} name={chosen.name} onCancel={() => setShow(false)} post={chosen} />}
            {loading ? <LoadingSpinner /> : 
            <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <h1 className='emp-dashboard-post-h1'>JOBS POSTED</h1>
                        <span className='button-span'><Button inverse size={`${window.innerWidth > 789 ? 'medium' : 'small'}`} className='emp-dashboard-post-button' to='/dashboard/newpost'>+ New Post</Button></span>
                    </div>
                    {jobs.length > 0 ? jobs.map((job, index) => {
                        return (
                            <div className='emp-job-div' key={index}>
                                <div className='emp-job-post'>
                                    <h3>{job.name}</h3>
                                    <section><b>Vacancies: </b>{job.vacancy}</section>
                                    <section><b>Applicants: </b>{job.applications.length}</section>
                                    <p><b>Date Posted: </b>{job.date.split('T')[0]}</p>
                                </div>
                                <div className='emp-job-post-button'>
                                    <span><Button danger size={`${window.innerWidth > 950 ? 'medium' : 'small'}`} onClick={() => onOpenApplication(job)}>Applications</Button></span>
                                    <span><Button size={`${window.innerWidth > 950 ? 'medium' : 'small'}`} onClick={() => onOpenPostDetail(job)}>Details</Button></span>
                                </div>
                            </div>
                        );
                    }) : <p style={{ color: 'red' }}>No jobs posted</p>}
                </Card>
                <div className='emp-dashboard-right'>
                    {details && <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name || '---'}</h1>
                        <p className='emp-dashboard-right-p' style={{ width: 'fit-content' }}><section className='emp-dashboard-right-section' style={{ display: 'inline' }}><b style={{ color: 'black' }}>Jobs Posted:</b><span style={{ width: '0.5rem' }} /> {details.posts.length || '-'}</section><section className='emp-dashboard-right-section' style={{ display: 'inline' }}><b style={{ color: 'black' }}>Staff:</b><span style={{ width: '0.5rem' }} /> {details.employees.length || '-'}</section></p>
                        <div className='emp-dashboard-right-details'>
                            <p className='emp-dashboard-right-p'><BsGlobe /><span style={{ width: '1rem' }} /> <a href={details.website && details.website} className='emp-dashboard-right-a'>{details.website ? details.website : "---"}</a></p>
                            <p className='emp-dashboard-right-p'><AiOutlineMail /><span style={{ width: '1rem' }} /> {details.email ? details.email : "---"}</p>
                            <p className='emp-dashboard-right-p'><BsTelephone /><span style={{ width: '1rem' }} /> {details.phone ? details.phone : "---"}</p>
                        </div>
                    </Card>}
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <div className='emp-dashboard-right-team-head'>
                            <h1 className='emp-dashboard-right-h1'>TEAM</h1>
                            <span><Button danger size={`${window.innerWidth > 789 ? 'medium' : 'small'}`} onClick={addEmployee} >ADD</Button></span>
                        </div>
                        {team.length > 0 ? team.map((t, index) => {
                            return (
                                <div className='team-div' key={index}>
                                    <div className='team-info'>
                                        <p className='team-name'>{t.name}</p>
                                        <p className='team-detail'>{t.post}</p>
                                    </div>
                                    <div className='team-button'>
                                        <Button title="Manage Permissions" size="square" onClick={() => onManagePermissionHandler(t)}><BsPencilFill /></Button>
                                        <Button transform='cross' onClick={() => deleteEmployee(t)}><AiOutlineClose /></Button>
                                    </div>
                                </div>
                            );
                        }) : <p style={{ color: 'red' }}>No Employees Registered</p>}
                    </Card>
                </div>
            </div>}
        </>
    );
};