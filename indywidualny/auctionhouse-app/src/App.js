import './App.css';
import 'react-notifications/lib/notifications.css';
import Login from './_page/Login';
import Logout from './_components/Logout';
import Register from './_page/Register';
import {Auctions} from './_page/Auctions';
import {Account} from './_page/Account';
import OfferDetails from './_page/OfferDetails';
import * as auth from './_services/AuthService';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
import {Navbar, Container, Nav, Switch} from 'react-bootstrap';
import { NotificationContainer } from 'react-notifications';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar bg="dark" className="py-3" >
            <Container>
              <Navbar.Brand>
                <Link to="/">
                  <img src="./img/logo.png" height="60"  className="d-inline-block align-top" alt="Auction house logo"/>
                </Link>
                </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link href="/auctions">Auctions</Nav.Link>
                  {!!auth.currentUserValue() ? <Nav.Link href="/account">My bets</Nav.Link> : ''}
                  {!auth.currentUserValue() ? <Nav.Link href="/login">Login</Nav.Link> : <Logout></Logout>}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Router>
      </header>

      <main>
        <Container>
          <Router>
            <Routes>
              <Route exact path='' element={<Auctions />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/register' element={<Register />} />
              <Route exact path='/auctions' element={<Auctions />} />
              <Route exact path='/offer-details/:id/:title' element={<OfferDetails />} />
              <Route exact path='/account' element={<Account />} />
            </Routes>
          </Router>
        </Container>
      </main>

      <footer className='d-grid align-content-center'>
        <p className='text-center text-white'>Super stopka</p>
      </footer>
      <NotificationContainer/>
    </div>
  );
}

export default App;
