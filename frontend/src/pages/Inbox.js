import React, { useState, useEffect, useContext } from 'react';
import './Inbox.css';

import { useHttp } from '../components/hooks/http-hook';
import { AuthContext } from '../components/context/auth-context';
import Button from '../components/utils/Button';
import { BsPencilFill } from 'react-icons/bs';
import LoadingSpinner from '../components/utils/LoadingSpinner';
import { ComposeModal } from './employer/EmployerModal';

export const Inbox = () => {
    // store the state of inbox
    const [inbox, setInbox] = useState([]);
    const [search, setSearch] = useState('');
    // inbox compose modal
    const [show, setShow] = useState(false);
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
    }, [show]);

    const openCompose = () => {
        setShow(true);
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
            {show && <ComposeModal show={show} onCancel={() => setShow(false)} />}
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