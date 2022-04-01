import './App.css';
import 'react-notifications/lib/notifications.css';
import { React, useState } from 'react';
import Login from './_page/Login';
import Logout from './_components/Logout';
import Register from './_page/Register';
import { Auctions } from './_page/Auctions';
import { Account } from './_page/Account';
import OfferDetails from './_page/OfferDetails';
import * as auth from './_services/AuthService';
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';

function App(props) {

  const [loggedIn, setLoggedIn] = useState(!!auth.currentUserValue());
  const [isAdmin, setIsAdmin] = useState(!!auth.currentUserValue() && auth.currentUserValue().is_admin);
  const [currentUrl, setCurrentUrl] = useState(useLocation().pathname);
  const handleSelect = (href) => { setCurrentUrl(href) };

  function setAppState() {
    console.log('app - update state', !!auth.currentUserValue(), !!auth.currentUserValue() && auth.currentUserValue().is_admin)
    setLoggedIn(!!auth.currentUserValue());
    setIsAdmin(!!auth.currentUserValue() && auth.currentUserValue().is_admin);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="dark" className="py-3" >
          <Container>
            <Nav className='w-100' activeKey={currentUrl} onSelect={handleSelect}> {/*  */}
              <Navbar.Brand>
                <Nav.Link to="/" href="/auctions">
                  <img src="/img/logo.png" height="60" className="d-inline-block align-top" alt="Auction house logo" />
                </Nav.Link>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Nav className='ms-auto' activeKey={currentUrl} onSelect={handleSelect}>
                <Navbar.Collapse id="basic-navbar-nav" >
                  {!!loggedIn ? <Navbar.Text>{auth.currentUserValue().username} </Navbar.Text> : null}
                  <Nav.Link href="/auctions">Auctions</Nav.Link>
                  {!!loggedIn && !auth.currentUserValue().is_admin ? <Nav.Link href="/account">Account</Nav.Link> : ''}
                  {!loggedIn ? <Nav.Link href="/login">Login</Nav.Link> : <Logout setAppState={setAppState}></Logout>}
                </Navbar.Collapse>
              </Nav>
            </Nav>
          </Container>
        </Navbar>
      </header>

      <main>
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/auctions" />} />
            <Route exact path='/auctions' element={<Auctions isAdmin={isAdmin} />}>
            </Route>
            <Route exact path='/auctions/:id/:title' element={<OfferDetails />} />
            <Route exact path='/register' element={<Register setAppState={setAppState} />} />

            <Route exact path='/login' element={<Login setAppState={setAppState} />} />
            <Route exact path='/account' element={<Account />} />

          </Routes>
        </Container>
      </main>

      <footer className='d-grid align-content-center'>
        <p className='text-center text-white'>Super stopka</p>
      </footer>
      <NotificationContainer />
    </div>
  );
}

export default App;
