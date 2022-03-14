import * as auth from '../_services/AuthService';
import { useState, useReducer } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

function Login() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();

  if (!!auth.currentUserValue()) {
    console.log('dudu')
    return (
      <Navigate to={{ pathname: '/auctions' }} />
    )
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (username && password) {
      console.log(username, password);
      auth.login({ username, password })
        .then((res) => {
          if (res) {
            forceUpdate();
            // navigate("/", { replace: true });
            // window.location.reload(false);
            // NotificationManager.success('Logged in successfully', 'Logged in!');
          } else {
            // NotificationManager.error('Username and/or password are inncorect', 'Error!');
          }
        })
        .catch((err) => {
          console.error(err);
        })
    } else {
      // 
    }
  }

  return (
    <section className='my-5'>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {/* <h2> Login </h2> */}
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name *</Form.Label>
              <Form.Control type="text" placeholder="Name" onChange={e => setUserName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password *</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="secondary" type="submit" className='w-100'>
              Login
            </Button>
          </Form>

          <p className="text-center mt-4">
            <Link to="/register" >Don't have an account? Register now!</Link>
          </p>
        </Col>
      </Row>

    </section>
  );
}

export default Login;
