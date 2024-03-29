import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';

import Card from '../../components/utils/Card';
import Button from '../../components/utils/Button';
import { DeleteModal } from '../employer/EmployerModal';
import { useHttp } from '../../components/hooks/http-hook';
import { AuthContext } from '../../components/context/auth-context';

import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import LoadingSpinner from '../../components/utils/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export const SeekerDashboard = props => {
    // navigate to different pages
    const navigate = useNavigate();
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
    // http hook to make requests
    const { loading, httpRequest } = useHttp();
    // calling auth hook
    const auth = useContext(AuthContext);
    // state to store dashboard variables
    const [details, setDetails] = useState();
    const [applied, setApplied] = useState([]);
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        // fetch details for the page
        async function fetchDetails() {
            let response;
            try {
                console.log(auth);
                response = await httpRequest(`http://localhost:5000/dashboard/${0}/${auth.userId}`);
            } catch (err) {}
            setDetails(response.user);
            setApplied(response.applications);
            setJobs(response.jobs);
            console.log(response);
        }
        fetchDetails();
    }, [show]);

    // to get jobs based on search using useEffect
    // const jobs = useRef([]);

    useEffect(() => {

    }, [search]);

    const onOpenApply = (application) => { // function to open modal to show all the applications for a particular opening
        setChosen(application);
        navigate(`/dashboard/applications/${application._id}`);
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

    const filterSubmit = async e => {
        e.preventDefault();
        // get posts based on filter
        let response;
        try {
            response = await httpRequest(
                `http://localhost:5000/dashboard/filter`,
                'POST',
                JSON.stringify({
                    minSalary: minSalary,
                    experience: experience,
                    location: location,
                    skills: skills
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}
        setJobs(response.posts);
        console.log(jobs);
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
        setChosen(team);
        console.log(chosen);
        setModal('DELETE');
        setShow(true);
    };

    return (
        <>
            <DeleteModal show={show && modal === 'DELETE'} action='apply' id={chosen._id} onCancel={() => setShow(false)} position={chosen.post} company={chosen.company} date={chosen.date} />
            {loading && <LoadingSpinner />}
            {!loading && <div className='emp-dashboard-container'>
                <Card elevation='complete' size='large' bgcolor='white' className="emp-dashboard-card">
                    <div className='post-header-div'>
                        <form onSubmit={onSubmitHandler}>
                            <input type="text" required onChange={onChangeHandler} value={search} name="search" placeholder='Search...' />
                            <button className='post-header-div-button'><AiOutlineSearch /></button>
                        </form>
                        <section style={{ 'margin-top': '1.7rem' }}><Button size="medium" inverse onClick={() => setFilter(!filter)}>Filter</Button></section>
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
                    {console.log("JOBS", jobs[0])}
                    {jobs.length > 0 ? jobs.map((job, index) => {
                        return (
                            <div className='skr-job'>
                                <div className='img' style={{ margin: '1rem', width: '5rem', height: 'inherit', 'border': '1px black solid', 'padding': '0px' }}>
                                    <img src="https://blog.hubspot.com/hubfs/image8-2.jpg" className="logo-google" />
                                </div>
                                <div className='skr-job-div' key={index}>
                                    <div className='skr-job-post'>
                                        <h3 style={{ 'font-size': '1.5rem', 'text-decoration': 'underline', 'margin-bottom': '0.3rem' }}>{job.name}</h3>
                                        <span style={{ 'margin-top': '1.3rem' }}><Button danger onClick={() => onOpenApply(job)} size={`${window.innerWidth > 789 ? 'medium' : 'small'}`}>Apply</Button></span>
                                    </div>
                                    <div className='skr-job-div-1'>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Company: </b>{job.company}</p>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Vacancies: </b>{job.vacancy}</p>
                                    </div>
                                    <div className='skr-job-div-1'>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Location: </b>{job.location}</p>
                                        <p className='skr-job-div-p' style={{ width: '70%', 'textAlign': 'left' }}><b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Salary: </b>{job.salary}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p style={{ color: 'red' }}>No Post Available</p>}
                </Card>
                <div className='emp-dashboard-right'>
                    {details && <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <h1 className='emp-dashboard-right-h1'>{details.name}</h1>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Email ID: </b> {details.email ? details.email : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Phone: </b> {details.phone ? details.phone : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Date of Birth: </b> {details.dob ? details.dob.split("T")[0] : "---"}</p>
                        <p className='skr-dashboard-right-p'><b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Gender: </b> {details.sex ? details.sex : "---"}</p>
                        <p className='skr-dashboard-right-p'>
                            <b style={{ color: 'black', 'margin-right': '0.3rem', width: '7rem' }}>Resume: </b>
                            {details.resume && <a href={details.resume} target='_blank' style={{ color: 'blue', 'text-decoration': 'underline' }}>Resume Link</a>}
                            {details.resume && <span style={{ width: '10%' }}></span>}
                            <Button danger size='small' to='/dashboard/profile'>Upload</Button>
                        </p>
                        <p className='skr-dashboard-right-p'>
                            <b style={{ color: 'black', 'margin-right': '0.3rem', width: '6rem' }}>Skills: </b> {details.skills.length > 0 ? details.skills.map((skill) => { return <section className="seeker-profile-skill">{skill}</section>; }) : "---"}
                        </p>
                    </Card>}
                    <Card elevation='complete' size='medium' bgcolor='white' className="emp-dashboard-card">
                        <div className='emp-dashboard-right-team-head'>
                            <h1 className='emp-dashboard-right-h1'>Applied</h1>
                        </div>
                        {applied.length > 0 ? applied.map((t, index) => {
                            console.log(t); 
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
            </div>}
        </>
    );
};