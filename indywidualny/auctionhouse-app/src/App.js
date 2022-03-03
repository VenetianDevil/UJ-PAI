import logo from './logo.svg';
import './App.css';
import Login from './Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {Navbar, Container, Nav} from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Navbar bg="dark" >
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
                  {false ? <Nav.Link href="/login">Login</Nav.Link> : <Nav.Link href="/">Logout</Nav.Link>}
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
