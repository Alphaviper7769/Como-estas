import React, { useState } from 'react';
import './Navbar.css';

import { NavLink } from 'react-router-dom';
import Backdrop from '../utils/Backdrop';
import SideDrawer from './SideDrawer';

export const Navbar = props => {
    const [drawer, setDrawer] = useState(false);

    return (
        <React.Fragment>
            {drawer && <Backdrop onClick={() => setDrawer(false)} />}
            <SideDrawer show={drawer} onClick={() => setDrawer(false)}>
                <div className='nav-side-drawer'>
                    {props.links.map((link) => {
                        return (
                            <section className='nav-section'><NavLink to={`/${link.toLowerCase()}`} exact className='navbar-link'>{link}</NavLink></section>
                        );
                    })}
                </div>
            </SideDrawer>
            <div className='nav-container'>
                <section className='nav-section-logo'><NavLink to="/dashboard">Como Estas</NavLink></section>
                <button className='nav-section-span' onClick={() => setDrawer(true)}><span></span><span></span><span></span></button>
                <div className='nav-body'>
                    {props.links.map((link) => {
                        return (
                            <section className='nav-section'><NavLink to={`/${link.toLowerCase()}`} exact className='navbar-link'>{link}</NavLink></section>
                        );
                    })}
                </div>
            </div>
        </React.Fragment>
    );
};