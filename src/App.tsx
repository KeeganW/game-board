import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

export function App() {
  return (
    <Container fluid>
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
            <Nav.Link as={Link} to="whales">Whales</Nav.Link>
            <Nav.Link as={Link} to="sharks">Sharks</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </Container>
  )
}
