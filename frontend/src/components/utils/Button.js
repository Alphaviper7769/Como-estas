import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {
  if (props.href) {
    return (
      <a
        className={` button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
        href={props.href}
        target={props.target}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    // to property is to redirect the user when button is clicked
    return (
      <Link
        to={props.to}
        exact={props.exact}
        target={props.target}
        className={`button button--${props.size || 'default'} ${props.inverse &&
          'button--inverse'} ${props.transform} ${props.danger && 'button--danger'}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button ${props.className} button--${props.size || 'default'} ${props.inverse &&
        'button--inverse'} ${props.btn_center} ${props.danger && 'button--danger'} ${props.radius} ${props.transform}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
