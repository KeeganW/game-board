import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { AuthContext } from 'src/Context'

export function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [playerPk, setPlayerPk] = useState(-1)
  const [groupPk, setGroupPk] = useState(-1)
  const [groupName, setGroupName] = useState('')
  const [groupImageUrl, setGroupImageUrl] = useState('')

  return (
    <Container fluid>
      <AuthContext.Provider
        value={{
          authenticated,
          setAuthenticated,
          playerPk,
          setPlayerPk,
          groupPk,
          setGroupPk,
          groupName,
          setGroupName,
          groupImageUrl,
          setGroupImageUrl,
        }}
      >
        <Navbar bg="light" variant="light" fixed="top">
          <Container>
            <Navbar.Brand as={Link} to={authenticated ? `group/${groupPk}` : ''}>
              <img
                alt=""
                src={
                  authenticated ? groupImageUrl : `${process.env.PUBLIC_URL}/img/logo_outline.png`
                }
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' '}
              {authenticated ? groupName : 'Game Board'}
            </Navbar.Brand>
            <Nav className="me-auto">
              {/* TODO move these into a hamburger menu when needed */}
              {authenticated && (
                <Nav.Link as={Link} to="/tournament">
                  Tournaments
                </Nav.Link>
              )}
              {authenticated && (
                <Nav.Link as={Link} to="/add_round">
                  Add Round
                </Nav.Link>
              )}
            </Nav>
            <Nav className="mr-auto">
              {/* TODO add link to profile page, hide under user image */}
              {authenticated ? (
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>
        <Outlet />
      </AuthContext.Provider>
    </Container>
  )
}
