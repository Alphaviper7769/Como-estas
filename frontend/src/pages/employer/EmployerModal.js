import React, { useState } from 'react';
import './EmployerModal.css';

import Modal from '../../components/utils/Modal';
import Button from '../../components/utils/Button';
import { AiOutlineClose } from 'react-icons/ai';

export const TeamModal = props => {
    const [data, setData] = useState({
        name: props.name || '',
        position: props.position || '',
        permission: props.permission || []
    });
    // let tempPost = props.posts;
    const [tempPosts, setTempPosts] = useState(props.posts);

    const { name, position, permission } = data;
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

    const onSubmitHandler = e => {
        e.preventDefault();
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
        <Modal show={!!props.show} header={props.name || 'NEW EMPLOYEE'} onCancel={props.onCancel} footer={<Button size="medium" onClick={props.onCancel}>SAVE</Button>} onSubmit={onSubmitHandler} >
            <div className='team-modal-div'>
                <label htmlFor='name'>Name: </label>
                <input type="text" name="name" value={name} onChange={onChangeHandler} disabled={props.disabled} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='position'>Position: </label>
                <input type="text" name="position" value={position} onChange={onChangeHandler} disabled={props.disabled} />
            </div>
            <div className='team-modal-div'>
                <label htmlFor='permissions'>Permissions: </label>
                <select name="permissions" onChange={onChangeHandler}>
                    {tempPosts.length > 0 && tempPosts.map((post) => {
                        return <option value={post._id}>{post.name} {"("}{post.date}{")"}</option>;
                    })}
                </select>
            </div>
            {permission.length > 0 && 
                <div className='team-modal-div' id="permission-div">
                    {permission.map((perm) => {
                        return <section><span style={{ color: '#2608b2', marginBottom: '1rem' }}>{findData(perm).name}{" ("}{findData(perm).date}{") "}</span><button onClick={(e) => onCancel(e, perm)}><AiOutlineClose /></button></section>;
                    })}
                </div>
            }
        </Modal>
    );
};

export const DeleteModal = props => {
    return (
        <Modal show={!!props.show} header="Confirm Delete" onCancel={props.onCancel} footer={<Button size="medium" onClick={props.onCancel} danger>DELETE</Button>}>
            <div className='delete-modal-div'>
                {props.name && <div className='delete-modal-p'><b>Name: </b><span>{props.name}</span></div>}
                {props.position && <div className='delete-modal-p'><b>Post: </b><span>{props.position}</span></div>}
                {props.company && <div className='delete-modal-p'><b>Company: </b><span>{props.company}</span></div>}
                {props.date && <div className='delete-modal-p'><b>Applied on: </b><span>{props.date}</span></div>}
            </div>
            <p className="delete-p">Confirm Delete ?</p>
        </Modal>
    );
};

export const PostDetailModal = props => {};

export const ApplicationModal = props => {};