import './App.css';
import Login from './_components/Login';
import {Auctions} from './_components/Auctions';
import {Account} from './_components/Account';
import * as auth from './_services/AuthService';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {Navbar, Container, Nav} from 'react-bootstrap';

function App() {

  function logout(){
    console.log('user clicked log out');
    auth.logout();
  }

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
                  <Nav.Link href="/account">My bets</Nav.Link>
                  {!localStorage.currentUser || localStorage.currentUser === 'undefined' || localStorage.currentUser === "[]" ? <Nav.Link href="/login">Login</Nav.Link> : <Nav.Link href="/" onClick={logout()}>Logout</Nav.Link>}
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
              <Route path='' element="" />
              <Route path='/login' element={<Login />} />
              <Route path='/auctions' element={<Auctions />} />
              <Route path='/account' element={<Account />} />
            </Routes>
          </Router>
        </Container>
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;
