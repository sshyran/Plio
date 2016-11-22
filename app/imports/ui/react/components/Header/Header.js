import React, { PropTypes } from 'react';
import { ArrowBack } from './ArrowBack';

const Header = ({ children, ...other }) => (
  <nav className="navbar" {...other}>
    {children}
  </nav>
);

Header.propTypes = {
  children: PropTypes.any,
};

Header.ArrowBack = ArrowBack;

export default Header;

