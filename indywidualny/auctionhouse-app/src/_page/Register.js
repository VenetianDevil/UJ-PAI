import * as auth from '../_services/AuthService';
import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { NotificationManager } from 'react-notifications';

function Login() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [password_conf, setPasswordConf] = useState();

  let navigate = useNavigate();

  if(auth.currentUserValue()){
    navigate("/");
  }

  const handleSubmit = async e => {
    e.preventDefault();
    // OBSŁUGA BŁĘDÓW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! zajeta nazwa użyt.
    if (username && password && password === password_conf) {
      auth.register({ username, password })
        .then((user) => {
          if(user){
            navigate("/login");
          }
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

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password *</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={e => setPasswordConf(e.target.value)} />
            </Form.Group>

            <Button variant="secondary" type="submit" className='w-100'>
              Register
            </Button>
          </Form>

          <p className="text-center mt-4">
            <Link to="/login" >Already have an account? Login now!</Link>
          </p>
        </Col>
      </Row>

    </section>
  );
}

export default Login;
