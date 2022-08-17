import React, { useState, useContext } from 'react';
import './Navbar.css';

import { NavLink } from 'react-router-dom';
import Backdrop from '../utils/Backdrop';
import SideDrawer from './SideDrawer';
import { AuthContext } from '../context/auth-context';

export const Navbar = props => {
    const [drawer, setDrawer] = useState(false);
    const auth = useContext(AuthContext);
    return (
        <React.Fragment>
            {drawer && <Backdrop onClick={() => setDrawer(false)} />}
            <SideDrawer show={drawer} onClick={() => setDrawer(false)}>
                <div className='nav-side-drawer'>
                    {/* {props.links.map((link) => {
                        return (
                            <section className='nav-section'><NavLink to={link[1]} exact className='navbar-link'>{link[0]}</NavLink></section>
                        );
                    })} */}
                    <section className='nav-section'><NavLink to="/dashboard" exact className='navbar-link'>Dashboard</NavLink></section>
                    <section className='nav-section'><NavLink to="/dashboard/inbox" exact className='navbar-link'>Inbox</NavLink></section>
                    <section className='nav-section'><NavLink to="dashboard/profile" exact className='navbar-link'>Profile</NavLink></section>
                    <section className='nav-section'><button className='navbar-link' onClick={() => auth.logout()}>Logout</button></section>
                </div>
            </SideDrawer>
            <div className='nav-container'>
                <section className='nav-section-logo'><NavLink to="/dashboard">Como Estas</NavLink></section>
                <button className='nav-section-span' onClick={() => setDrawer(true)}><span></span><span></span><span></span></button>
                <div className='nav-body'>
                    {/* {props.links.map((link) => {
                        return (
                            <section className='nav-section'><NavLink to={link[1]} exact className='navbar-link'>{link[0]}</NavLink></section>
                        );
                    })} */}
                     <section className='nav-section'><NavLink to="/dashboard" exact className='navbar-link'>Dashboard</NavLink></section>
                     <section className='nav-section'><NavLink to="/dashboard/inbox" exact className='navbar-link'>Inbox</NavLink></section>
                     <section className='nav-section'><NavLink to="dashboard/profile" exact className='navbar-link'>Profile</NavLink></section>
                     <section className='nav-section'><button className='navbar-link' onClick={() => auth.logout()}>Logout</button></section>
                </div>
            </div>
        </React.Fragment>
    );
};