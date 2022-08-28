import React, { useState, useEffect, useContext, useRef } from 'react';
import './EmployerModal.css';

import Modal from '../../components/utils/Modal';
import Button from '../../components/utils/Button';
import { useHttp } from '../../components/hooks/http-hook';
import { AuthContext } from '../../components/context/auth-context';
import { AiOutlineClose } from 'react-icons/ai';

export const TeamModal = props => {
    // state of displaying the form
    const [close, setClose] = useState(false);
    const [data, setData] = useState({
        name: props.name || '',
        position: props.position || '',
        permission: props.permission || [],
        email: '',
        password: ''
    });

    // auth and http hooks
    const auth = useContext(AuthContext);
    const { httpRequest } = useHttp();

    const { name, position, permission, email, password } = data;
    const [tempPosts, setTempPosts] = useState(props.posts);
    tempPosts && tempPosts.filter((post) => {
        let index = permission.indexOf(post._id);
        return index < 0;
    });
    const onChangeHandler = e => {
        if(e.target.name === "permissions") {
            // for select tag
            permission.push(e.target.value);
            setData({ ...data, permission: permission });
            // remove the selected option from the list
            setTempPosts(tempPosts.filter(temp => temp._id !== e.target.value));
        } else {
            setData({ ...data, [e.target.name]: e.target.value });
        }
    };

    const onSubmitHandler =  async e => {
        e.preventDefault();
        if(props.disabled) {
            // update permissions
            let response;
            try {
                response = await httpRequest(
                    `http://localhost:5000/dashboard/permission`,
                    'PATCH',
                    JSON.stringify({
                        employeeID: props.id,
                        permissions: permission,
                        userID: auth.userId
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                );
            } catch (err) {}
        } else {
            // add employee
            var response;
            try {
                response = await httpRequest(
                    `http://localhost:5000/dashboard/team`, 
                    'POST',
                    JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        post: position,
                        permissions: permission,
                        companyID: auth.userId
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                )
            } catch (err) {}
        }
        setData({
            name: props.name || '',
            position: props.position || '',
            permission: props.permission || [],
            email: '',
            password: ''
        });
        setClose(true);
    };

    const onCancel = (e, perm) => {
        e.preventDefault();
        // removing id from array of permissions
        let index = permission.indexOf(perm);
        index > -1 && permission.splice(index, 1);
        setData({ ...data, permission: permission });
        // add the post to the option list
        let p = tempPosts;
        p.push(findData(perm));
        setTempPosts(p);
    };

    // find post from id
    const findData = (id) => {
        return props.posts.find(post => post._id == id) || "";
    };

    return (
        <Modal show={!!props.show} header={props.name || 'NEW EMPLOYEE'} onCancel={props.onCancel} footer={<Button size='medium'>SUBMIT</Button>} onSubmit={onSubmitHandler}>
            {!close ? <>
                <div className='team-modal-div'>
                    <label htmlFor='name'>Name: </label>
                    <input type="text" name="name" value={name} onChange={onChangeHandler} disabled={props.disabled} />
                </div>
                <div className='team-modal-div'>
                    <label htmlFor='position'>Position: </label>
                    <input type="text" name="position" value={position} onChange={onChangeHandler} disabled={props.disabled} />
                </div>
                {!props.disabled && <div className='team-modal-div'>
                    <label htmlFor='email'>Email ID: </label>
                    <input type="email" name="email" value={email} onChange={onChangeHandler} />
                </div>}
                {!props.disabled && <div className='team-modal-div'>
                    <label htmlFor='password'>Set Password: </label>
                    <input type="password" name="password" value={password} onChange={onChangeHandler} />
                </div>}
                <div className='team-modal-div'>
                    <label htmlFor='permissions'>Permissions: </label>
                    <select name="permissions" onChange={onChangeHandler}>
                        <option>Select Posts</option>
                        {tempPosts.length > 0 && tempPosts.map((post) => {
                            return <option value={post._id}>{post.name} {"("}{post.date.split('T')[0]}{")"}</option>;
                        })}
                    </select>
                </div>
                {permission.length > 0 && 
                    <div className='team-modal-div' id="permission-div">
                        {permission.map((perm) => {
                            return <section><span style={{ color: '#2608b2', marginBottom: '1rem' }}>{findData(perm).name}{" ("}{findData(perm).date.split('T')[0]}{") "}</span><button onClick={(e) => onCancel(e, perm)}><AiOutlineClose /></button></section>;
                        })}
                    </div>
                }
            </> : <p style={{ 'font-size': '1.3rem', 'text-align': 'center' }}>Successful!</p>}
        </Modal>
    );
};

export const DeleteModal = props => {
    // auth and http hooks
    const auth = useContext(AuthContext);
    const { httpRequest } = useHttp();
    // deleted?
    const [deleted, setDeleted] = useState(false);

    const deleteHandler = async () => {
        let response;
        try {
            response = await httpRequest(`http://localhost:5000/dashboard/${props.action}/${props.id}/${auth.userId}`, 'DELETE', null, {
                Authorization: 'Bearer ' + auth.token
            });
        } catch (err) {}
        setDeleted(true);
    };

    return (
        <Modal show={!!props.show} header="Confirm Delete" onCancel={props.onCancel} footer={!deleted && <Button size="medium" onClick={deleteHandler} danger>DELETE</Button>}>
            {!deleted ? <>
                <div className='delete-modal-div'>
                    {props.name && <div className='delete-modal-p'><b>Name: </b><span>{props.name}</span></div>}
                    {props.position && <div className='delete-modal-p'><b>Post: </b><span>{props.position}</span></div>}
                    {props.company && <div className='delete-modal-p'><b>Company: </b><span>{props.company}</span></div>}
                    {props.date && <div className='delete-modal-p'><b>Applied on: </b><span>{props.date}</span></div>}
                </div>
                <p className="delete-p">Confirm Delete ?</p>
            </> : <p className='delete-p'>Deleted!</p>}
        </Modal>
    );
};

export const PostDetailModal = props => {
    // auth and http hooks
    const auth = useContext(AuthContext);
    const { httpRequest } = useHttp();
    // hold the current values
    const [data, setData] = useState({
        name: props.post.name,
        vacancy: props.post.vacancy || 0,
        skills: props.post.skills.length > 0 ? props.post.skills.map((skill) => {
            return skill.toString();
        }) : '',
        eligibility: props.post.eligibility.length > 0 ? props.post.eligibility.map((eligible) => {
            return eligible.toString();
        }) : '',
        questions: props.post.questions.length > 0 ? props.post.questions.map((question) => {
            return question.toString();
        }) : '',
        dueDate: props.post.dueDate.split('T')[0],
        salary: props.post.salary || 0,
        location: props.post.location || 'Anywhere',
        experience: props.post.experience || 0
    });
    const disabled =  useRef(true);

    const { name, vacancy, skills, eligibility, questions, dueDate, salary, location, experience } = data;

    useEffect(() => {
        async function getEmployee() {
            let response;
            try {
                response = await httpRequest(`dashboard/profile/${1}/${auth.userId}`);
            } catch (err) {}
            response.user.permissions.length > 0 && response.user.permissions.find((perm) => {
                if(perm == auth.userId) {
                    disabled.current = false;
                }
            });
        }

        if(props.post.companyID == auth.userId) {
            disabled.current = false;
        } else {
            // check if employee has permission
            getEmployee();
        }
    }, []);

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    const onSubmitHandler = async e => {
        e.preventDefault();
        // update post
        let response;
        try {
            response = await httpRequest(
                'http://localhost:5000/dashboard/post',
                'PATCH',
                JSON.stringify({
                    postID: props.post._id.toString(),
                    name: name,
                    vacancy: vacancy,
                    skills: skills.split(','),
                    eligibility: eligibility.split(','),
                    questions: questions.split(','),
                    dueDate: dueDate,
                    salary: salary,
                    location: location,
                    experience: experience,
                    userID: auth.userId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}
    };

    return (
        <Modal header={props.name} show={props.show} onCancel={props.onCancel} footer={!disabled.current && <Button size='medium'>SAVE</Button>} onSubmit={onSubmitHandler}>
            <div className='team-modal-div'>
                <label htmlFor='name'>Position: </label>
                <input type="text" name="name" value={name} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='vacancy'>Vacancies: </label>
                <input type="number" name="vacancy" value={vacancy} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='dueDate'>Due Date: </label>
                <input type="text" name="dueDate" value={dueDate} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='salary'>Salary: </label>
                <input type="number" name="salary" value={salary} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='location'>Location: </label>
                <input type="text" name="location" value={location} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='experience'>Experience: </label>
                <input type="number" name="experience" value={experience} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='skills'>Skills Required: </label>
                <input type="text" name="skills" value={skills} onChange={onChangeHandler} disabled={disabled.current} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='eligibility'>Eligibility: </label>
                <textarea name="eligibility" value={eligibility} onChange={onChangeHandler} disabled={disabled.current} placeholder='Enter comma seperated Eligibility Criteria. Eg. BTech in CS,18 Years' />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='questions'>Questions: </label>
                <textarea name="questions" value={questions} onChange={onChangeHandler} disabled={disabled.current} placeholder='Enter comma seperated Questions. Add question marks if required. Eg. Why do you want this job?,Where do you see yourself in 5 years?' />
            </div>
        </Modal>
    );
};

export const ApplicationModal = props => {
    const { httpRequest } = useHttp();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        // fetch all applicants
        async function fetchApplicants() {
            let response;
            try {
                response = await httpRequest(`http://localhost:5000/dashboard/apply/${props.job._id.toString()}`);
            } catch (err) {}
            response && setApplicants(response.application);
        }
        fetchApplicants();
    }, []);
    return (
        <Modal show={props.show} header={props.name} onCancel={props.onCancel} footer={<Button size="medium" onClick={props.onCancel}>CLOSE</Button>}>
            
            {applicants && <div className='application-list-modal'>
                {applicants.length > 0 ? applicants.map((applicant) => {
                    return (<div className='application-list-individual'>
                        <section>{applicant.user.name ? applicant.user.name : '---' }</section>
                        <span>
                            <Button danger to={applicant.user.resume || ''}>Resume</Button>
                            <Button inverse to={`/dashboard/applications/${applicant.application._id.toString()}`}>Open</Button>
                        </span>
                    </div>);
                }) : <p style={{ color: 'red', margin: 'auto' }}>No Applications</p>}
            </div>}
        </Modal>
    );
};

export const ErrorModal = props => {
    return (
        <Modal show={props.show} header="Error" footer={<Button danger onClick={props.onCancel}>CLOSE</Button>} onCancel={props.onCancel} >
            <p className='error-modal-p'>{props.error}</p>
        </Modal>
    );
};

export const ComposeModal = props => {
    const auth = useContext(AuthContext);
    const { httpRequest } = useHttp();
    const [data, setData] = useState({
        email: '',
        message: ''
    });
    const { email, message } = data;

    const onChangeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        let response;
        try {
            response = await httpRequest(
                'http://localhost:5000/dashboard/inbox',
                'PATCH',
                JSON.stringify({
                    email: email,
                    senderID: auth.userId,
                    message: message
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
        } catch (err) {}
        setData({
            email: '',
            message: ''
        });
    };
    return (
        <Modal show={props.show} header='Compose' footer={<Button danger>Send</Button>} onCancel={props.onCancel} onSubmit={onSubmitHandler}>
            <div className='inbox-compose-div'>
                <label htmlFor='email'>Email ID</label>
                <input type='email' name='email' value={email} onChange={onChangeHandler} required />
            </div>
            <div className='inbox-compose-div'>
                <label htmlFor='message'>Message</label>
                <textarea name='message' value={message} onChange={onChangeHandler} required style={{ height: '7rem', width: '90%', padding: '1rem' }} />
            </div>
        </Modal>
    );
};