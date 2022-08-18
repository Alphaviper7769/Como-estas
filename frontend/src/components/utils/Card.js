import React from 'react';
import './Card.css';

export default function Card(props) {
    return(
        <div className={`Card elevation--${props.elevation} ${props.position} ${props.size} ${props.bgcolor} ${props.className} `}>
            {props.children}
        </div>
    );
};