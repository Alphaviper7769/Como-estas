import React from 'react';
import './Navbar.css';

import { BrowserRouter, Link } from 'react-router-dom';

export const Navbar = props => {
    return (
        <div className='nav-container'>
            <BrowserRouter>
                <section className='nav-section-logo'><Link to="/dashboard">Como Estas</Link></section>
                <div className='nav-body'>
                    {props.links.map((link) => {
                        return (
                            <section className='nav-section'><Link to={`/${link}`} exact className='navbar-link'>{link}</Link></section>
                        );
                    })}
                </div>
            </BrowserRouter>
        </div>
    );
};