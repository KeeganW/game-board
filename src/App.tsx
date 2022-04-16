import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { AuthContext } from 'src/Context';

export function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [player, setPlayer] = useState(-1);
  return (
    <Container fluid>
      <AuthContext.Provider value={{ authenticated, setAuthenticated, player, setPlayer }}>
      <Navbar bg="light" variant="light" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="">
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/logo192.png`}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {' '}
            Sea Life
          </Navbar.Brand>
          <Nav className="mr-auto">
            { authenticated ? <Nav.Link as={Link} to="/logout">Logout</Nav.Link> : <Nav.Link as={Link} to="/login">Login</Nav.Link> }
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
      </AuthContext.Provider>
    </Container>
  )
}


