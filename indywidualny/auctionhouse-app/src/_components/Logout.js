import * as auth from '../_services/AuthService';
import { useState } from 'react';
import { Nav, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

function Logout() {
  let navigate = useNavigate();

  const handleLogout = async e => {
    e.preventDefault();
    e.preventDefault();
    console.log('user clicked log out');
    auth.logout().then(() => {
      console.log('i do loginu')
      navigate("/login", { replace: true })
      window.location.reload(false);
    })
  }

  return (
    <Nav.Link role="button" onClick={handleLogout}>Logout</Nav.Link>
  );
}

export default Logout;
