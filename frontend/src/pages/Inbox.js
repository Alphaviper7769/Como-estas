import React, { useState } from 'react';
import './Inbox.css';

import Button from '../components/utils/Button';
import { BsPencilFill } from 'react-icons/bs';

const inbox = [
    {
        sender: 'Credence ENgineering Services',
        message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
    },
    {
        sender: 'Credence ENgineering Services',
        message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
    },
    {
        sender: 'Credence ENgineering Services',
        message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
    },
    {
        sender: 'Credence ENgineering Services',
        message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
    },
    {
        sender: 'Credence ENgineering Services',
        message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
    }
];

export const Inbox = props => {
    const [search, setSearch] = useState('');

    const openCompose = () => {

    };

    const onChangeHandler = e => {
        setSearch(e.target.value);
    };

    const onSubmitHandler = e => {
        e.preventDefault();
        setSearch('');
    };

    return (
        <div className='inbox-container'>
            <div className='inbox-header'>
                <h1 style={{ color: 'black' }}>INBOX</h1>
                <form onSubmit={onSubmitHandler}>
                    <input type='text' required name='search' placeholder='Search Inbox...' value={search} onChange={onChangeHandler} />
                    <Button type='submit' danger size={window.innerWidth > 800 ? 'medium' : 'small'}>Search</Button>
                </form>
            </div>
            <ul>
                {inbox.map((inb) => {
                    return (
                        <li>
                            <div className='inbox-message'>
                                <h3>{inb.sender}</h3>
                                <section></section>
                                <p>{inb.message}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <button className='inbox-compose-button' onClick={openCompose} title="Compose"><BsPencilFill /></button>
        </div>
    );
};