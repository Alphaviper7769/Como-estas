import React, { useEffect, useState } from 'react';
import './Dashboard.css';

import Card from '../../components/utils/Card';
import Button from '../../components/utils/Button';
import Modal from '../../components/utils/Modal';
import { DeleteModal } from '../employer/EmployerModal';

import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';

const jobs = [
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        salary: 'Rs 10000/Month'
    },
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        salary: 'Rs 10000/Month'
    },
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        vacancies: 10,
        skills: ['Javascript, ReactJS, Nodejs'],
        location: 'Bangalore',
        salary: 'Rs 10000/Month'
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
    },
    {
        post: 'Web Developer',
        company: 'Credence Engineering Services',
        date: '22 July 2002'
    },
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
    // state to hold search value
    const [search, setSearch] = useState('');
    // state to toggle filter box
    const [filter, setFilter] = useState(false);
    // state to hold filter values
    const [filterData, setFilterData] = useState({
        minSalary: null,
        experience: null,
        location: '',
        skills: []
    });
    // to push skills
    const [skill, setSkill] = useState('');

    const { minSalary, experience, location, skills } = filterData;

    // to get jobs based on search using useEffect
    // const jobs = useRef([]);

    useEffect(() => {

    }, [search]);

    const onOpenApply = (application) => { // function to open modal to show all the applications for a particular opening
        setChosen(application);
        setModal('APPLY')
        setShow(true);
    };

    const onChangeHandler = e => {
        setSearch(e.target.value);
    };

    const onSubmitHandler = e => {
        e.preventDefault();
        setSearch('');
    };

    const changeSkill = e => {
        setSkill(e.target.value);
    };

    const submitSkill = e => {
        e.preventDefault();
        skills.push(skill);
        setSkill('');
    };

    const clearSkill = s => {
        let index = skills.indexOf(s); 
        index > -1 && skills.splice(index, 1);
        setFilter({ ...filterData, skills: skills });
    };

    const filterChange = e => {
        setFilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const filterSubmit = e => {
        e.preventDefault();
        // set it back to initial state
        setFilterData({
            minSalary: null,
            experience: null,
            location: '',
            skills: []
        });
    };

    // to delete application
    const deleteModal = team => {
        setShow(true);
        setChosen(team);
        setModal('DELETE');
    };

    return (
        <>
            <Modal show={show && modal === 'TEAM'} header={modal === 'TEAM' ? chosen.name : chosen.post} onCancel={() => setShow(false)}>

            </Modal>
            <Modal show={show && modal === 'DELETE'} header="DELETE" onCancel={() => setShow(false)} footer={<Button danger onClick={() => setShow(false)}>DELETE</Button>} >

            </Modal>
            <DeleteModal show={show && modal === 'DELETE'} onCancel={() => setShow(false)} position={chosen.post} company={chosen.company} date={chosen.date} />
            <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <form onSubmit={onSubmitHandler}>
                            <input type="text" required onChange={onChangeHandler} value={search} name="search" placeholder='Search...' />
                            <button className='post-header-div-button'><AiOutlineSearch /></button>
                        </form>
                        <section style={{ 'margin-top': '1.7rem' }}><Button size={`${window.innerWidth > 789 ? 'medium' : 'small'}`} inverse onClick={() => setFilter(!filter)}>Filter</Button></section>
                    </div>
                    <div className='skr-filter-div' style={{ display: filter ? 'block' : 'none' }}>
                        {/* Filters on Salary -> min, experience, location, skills, company */}
                        <form onSubmit={submitSkill} className='filter-skills-form'>
                            <div className='filter-skills'>
                                <section>Skills: </section>
                                <input type='text' value={skill} name='skill' onChange={changeSkill} />
                                <span><Button type='submit' size='small'>Add</Button></span>
                            </div>
                            {skills.length > 0 && <div className='filter-list-skills' style={{ display: 'flex', 'flex-direction': 'row' }}>
                                {skills.map((s) => {
                                    return <section className='skill-section'>{s}<span /><section style={{ cursor: 'pointer', color: 'black' }} onClick={() => clearSkill(s)}><AiOutlineClose /></section></section>
                                })}
                            </div>}
                        </form>
                        <form onSubmit={filterSubmit}>
                            <div style={{ display: 'flex', 'flex-dorection': 'row', justifyContent: 'space-between', margin: '1.5rem 0rem' }}>
                                <div className='filter-input-div' style={{ display: 'flex', 'flex-direction': 'row' }}>
                                    <section>Salary: </section>
                                    <input type='number' onChange={filterChange} name='minSalary' value={minSalary} />
                                    <section>LPA</section>
                                </div>
                                <div className='filter-input-div' style={{ display: 'flex', 'flex-direction': 'row' }}>
                                    <section>Experience: </section>
                                    <input type='number' onChange={filterChange} name='experience' value={experience} />
                                    <section>Years</section>
                                </div>
                            </div>
                            <div style={{ display: 'flex', 'flex-dorection': 'row', justifyContent: 'space-between', margin: '1.5rem 0rem' }}>
                                <div className='filter-input-div' style={{ display: 'flex', 'flex-direction': 'row' }}>
                                    <section>Location : </section>
                                    <input type='text' onChange={filterChange} name='location' value={location} placeholder='City' />
                                </div>
                                <Button type='submit'>Save</Button>
                            </div>
                        </form>
                    </div>
                    {jobs.map((job, index) => {
                        return (
                            <div className='skr-job'>
                                <div className='img' style={{ margin: '1rem', width: '5rem', height: 'inherit', 'border': '1px black solid' }}>
                                    { /* INSERT IMAGE HERE */ } 
                                </div>
                                <div className='skr-job-div' key={index}>
                                    <div className='skr-job-post'>
                                        <h3 style={{ 'font-size': '1.5rem', 'text-decoration': 'underline', 'margin-bottom': '0.3rem' }}>{job.post}</h3>
                                        <span style={{ 'margin-top': '1.3rem' }}><Button danger onClick={() => onOpenApply(job)} size={`${window.innerWidth > 789 ? 'medium' : 'small'}`}>Appy</Button></span>
                                    </div>
                                    <div className='skr-job-div-1'>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Company: </b>{job.company}</p>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Vacancies: </b>{job.vacancies}</p>
                                    </div>
                                    <div className='skr-job-div-1'>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Location: </b>{job.location}</p>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Salary: </b>{job.salary}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Card>
                <div className='emp-dashboard-right'>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name}</h1>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Email ID: </b> {details.email ? details.email : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Phone: </b> {details.phone ? details.phone : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Date of Birth: </b> {details.dob ? details.dob : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Gender: </b> {details.gender ? details.gender : "---"}</p>
                        <p className='skr-dashboard-right-p'>
                            <b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Resume: </b>
                            {details.resume && <a href={details.resume} target='_blank' style={{ color: 'blue', 'text-decoration': 'underline' }}>Resume Link</a>}
                            {details.resume && <span style={{ width: '10%' }}></span>}
                            <button className='resume-change-button' style={{ 'background': 'red', color: 'white' }}>Upload</button>
                        </p>
                        <p className='skr-dashboard-right-p'>
                            <b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Skills: </b> {details.skills.length > 0 ? details.skills.map((skill) => { return <section className="seeker-profile-skill">{skill}</section>; }) : "---"}
                        </p>
                    </Card>
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <div className='emp-dashboard-right-team-head'>
                            <h1 className='emp-dashboard-right-h1'>Applied</h1>
                        </div>
                        {applied.length > 0 ? applied.map((t, index) => {
                            return (
                                <div className='team-div' key={index}>
                                    <p className='team-name' id='applied-name'>{t.post}</p>
                                    <div>
                                        <div className='team-info'>
                                            <p className='applied-detail'>{t.company}</p>
                                            <p className='applied-detail'>Applied on {t.date}</p>
                                        </div>
                                        <div className='applied-button'>
                                            <Button transform='cross' onClick={() => deleteModal(t)}><AiOutlineClose /></Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : <p style={{ color: 'red' }}>No Applications</p>}
                    </Card>
                </div>
            </div>
        </>
    );
};