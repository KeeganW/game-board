import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { AuthContext } from 'src/Context'
import { getTokens, getUserState } from 'src/utils/localStorageService'

export const App = () => {
  const tokens = getTokens()
  const initialState = getUserState()

  const [authenticated, setAuthenticated] = useState(!!tokens.access)
  const [tokenAccess, setTokenAccess] = useState(tokens.access || '')
  const [tokenRefresh, setTokenRefresh] = useState(tokens.refresh || '')
  const [playerPk, setPlayerPk] = useState(initialState.playerPk)
  const [groupPk, setGroupPk] = useState(initialState.groupPk)
  const [groupName, setGroupName] = useState(initialState.groupName)
  const [groupImageUrl, setGroupImageUrl] = useState(initialState.groupImageUrl)

  return (
    <Container fluid>
      <AuthContext.Provider
        // TODO(keegan): fix this memo issue
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{
          authenticated,
          setAuthenticated,
          tokenAccess,
          setTokenAccess,
          tokenRefresh,
          setTokenRefresh,
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
            <Navbar.Brand
              as={Link}
              to={authenticated ? `group/${groupPk}` : ''}
            >
              <img
                alt=""
                src={
                  authenticated
                    ? groupImageUrl
                    : `${process.env.PUBLIC_URL}/img/logo_outline.png`
                }
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
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
                  {/* <Nav.Link as={Link} to="/signup"> */}
                  {/*   Signup */}
                  {/* </Nav.Link> */}
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
