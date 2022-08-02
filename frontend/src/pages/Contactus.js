import React from 'react'
import './Contactus.css';

import { AiOutlineMail, AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai';

const members = [
    {
        name: 'Raj Aryan',
        github: 'https://github.com/rajaryan18',
        linkedin: 'https://www.linkedin.com/in/thatrajaryan',
        gmail: 'btech10078.21@bitmesra.ac.in'
    },
    {
        name: 'Brateek Krishna',
        github: 'https://github.com/rajaryan18',
        linkedin: 'https://www.linkedin.com/in/thatrajaryan',
        gmail: 'btech10078.21@bitmesra.ac.in'
    },
    {
        name: 'Ritika Prasad',
        github: 'https://github.com/rajaryan18',
        linkedin: 'https://www.linkedin.com/in/thatrajaryan',
        gmail: 'btech10078.21@bitmesra.ac.in'
    },
    {
        name: 'Aayush Raturi',
        github: 'https://github.com/rajaryan18',
        linkedin: 'https://www.linkedin.com/in/thatrajaryan',
        gmail: 'btech10078.21@bitmesra.ac.in'
    }
];

export const Contactus = () => {
    return (
        <div className='contactus-container'>
            <h1>CONTACT US</h1>
            <h3>@ Como Estas</h3>
            {members.map((member) => {
                return (
                    <div className='member-details'>
                        <h3>{member.name}</h3>
                        <span></span>
                        <a href={`${member.linkedin}`} target='_blank'><AiOutlineLinkedin /></a>
                        <a href={`${member.github}`} target='_blank'><AiOutlineGithub /></a>
                        <a href={`mailto:${member.gmail}`} target='_blank'><AiOutlineMail /></a>
                    </div>
                );
            })}
        </div>
    );
};