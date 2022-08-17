import React, { useState, useEffect, useContext } from 'react';
import './Inbox.css';

import { useHttp } from '../components/hooks/http-hook';
import { AuthContext } from '../components/context/auth-context';
import Button from '../components/utils/Button';
import { BsPencilFill } from 'react-icons/bs';
import LoadingSpinner from '../components/utils/LoadingSpinner';

// const inbox = [
//     {
//         sender: 'Credence ENgineering Services',
//         message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
//     },
//     {
//         sender: 'Credence ENgineering Services',
//         message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
//     },
//     {
//         sender: 'Credence ENgineering Services',
//         message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
//     },
//     {
//         sender: 'Credence ENgineering Services',
//         message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
//     },
//     {
//         sender: 'Credence ENgineering Services',
//         message: 'This is a test message from Raj because he is testing long messages. He is unable to think of a proper message so he is typing what he is thinking. Maybe you ould do that too'
//     }
// ];

export const Inbox = props => {
    // store the state of inbox
    const [inbox, setInbox] = useState([]);
    const [search, setSearch] = useState('');
    // get userID from auth context
    const auth = useContext(AuthContext);
    // http hook
    const { loading, error, clearError, httpRequest } = useHttp();

    useEffect(() => {
        async function getInbox() {
            let response;
            try {
                response = await httpRequest(`http://localhost:5000/dashboard/inbox/${auth.userId}`);
            } catch (err) {}

            setInbox(response.inbox.inbox);
        }
        getInbox();
    }, []);

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
        <>
            {loading && <LoadingSpinner />}
            {!loading && <div className='inbox-container'>
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
            </div>}
        </>
    );
};