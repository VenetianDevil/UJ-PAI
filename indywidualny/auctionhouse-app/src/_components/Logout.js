import * as auth from '../_services/AuthService';
import { useState, useContext } from 'react';
import { Nav, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

function Logout(props) {
  let navigate = useNavigate();

  const handleLogout = async e => {
    e.preventDefault();
    console.log('user clicked log out');
    return auth.logout().then(() => {
      console.log('i do loginu')
      props.setAppState();
      navigate("/login")
      // window.location.reload(false);
    })
  }

  return (
    <Nav.Link role="button" onClick={handleLogout}>Logout</Nav.Link>
  );
}

export default Logout;
