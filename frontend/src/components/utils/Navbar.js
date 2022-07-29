import React from 'react';
import './Navbar.css';

import { BrowserRouter, NavLink } from 'react-router-dom';

export const Navbar = props => {
    return (
        <div className='nav-container'>
            <BrowserRouter>
                <section className='nav-section-logo'><NavLink to="/dashboard">Como Estas</NavLink></section>
                <div className='nav-body'>
                    {props.links.map((link) => {
                        return (
                            <section className='nav-section'><NavLink to={`/${link.toLowerCase()}`} exact className='navbar-link'>{link}</NavLink></section>
                        );
                    })}
                </div>
            </BrowserRouter>
        </div>
    );
};