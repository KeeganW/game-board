import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { getTokens, getUserState } from 'src/utils/localStorageService'
import {
  AppShell,
  Burger,
  Group,
  Button,
  Drawer,
  Divider,
  rem,
  ScrollArea,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './App.module.css'

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

  const [opened, { toggle }] = useDisclosure()

  const groupLink = authenticated ? (
    <a href={`#/group/${groupPk}`} className={classes.link}>
      <img
        alt=""
        src={groupImageUrl}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      {groupName}
    </a>
  ) : (
    <a href="#/" className={classes.link}>
      <img
        alt=""
        src={`${process.env.PUBLIC_URL}/img/logo_outline.png`}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
    </a>
  )

  const mainLinks = authenticated
    ? [
        <a href={`#/player/${playerPk}`} className={classes.link}>
          Home
        </a>,
        <a href="#/tournament" className={classes.link}>
          Tournaments
        </a>,
        <a href="#/add_round" className={classes.link}>
          Add Round
        </a>,
      ]
    : [
        <a href="#/current" className={classes.link}>
          Current Standings
        </a>,
        <a href="#/acr" className={classes.link}>
          Add Round
        </a>,
      ]

  const authLinks = authenticated
    ? [
        <Button component="a" href="#/logout" variant="default">
          Log out
        </Button>,
      ]
    : [
        <Button component="a" href="#/login" variant="default">
          Log in
        </Button>,
        // {/* <Button>Sign up</Button> */}
      ]

  return (
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
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" h="100%">
            {/* Style added here because we need to balance the left and right to center middle */}
            <Group h="100%" gap={0} visibleFrom="sm" style={{ width: '110px' }}>
              {groupLink}
            </Group>

            <Group h="100%" gap={0} visibleFrom="sm">
              {mainLinks}
            </Group>

            <Group visibleFrom="sm" px="md">
              {authLinks}
            </Group>
          </Group>
          <Drawer
            opened={opened}
            onClose={toggle}
            size="100%"
            padding="md"
            title="Navigation"
            hiddenFrom="sm"
            zIndex={1000000}
          >
            <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
              <Divider my="sm" />

              <Group h="100%" gap={0}>
                {mainLinks}
              </Group>

              <Divider my="sm" />

              <Group justify="center" grow pb="xl" px="md">
                {authLinks}
              </Group>
            </ScrollArea>
          </Drawer>
        </AppShell.Header>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      {/* <div style={{ */}
      {/*   display: 'flex', */}
      {/*   alignItems: 'center', */}
      {/*   height: '100%' */}
      {/* }}> */}
      {/*   <MediaQuery largerThan="sm" styles={{ display: 'none' }}> */}
      {/*     <Burger */}
      {/*       opened={opened} */}
      {/*       onClick={() => setOpened((o) => !o)} */}
      {/*       size="sm" */}
      {/*       color={theme.colors.gray[6]} */}
      {/*       mr="xl" */}
      {/*     /> */}
      {/*   </MediaQuery> */}
      {/*   /!* <BootstrapNavbar bg="light" variant="light" fixed="top"> *!/ */}
      {/*   /!* TODO(keegan): navbar components we truly need: Tournaments, Group, Profile, Add Round, logout *!/ */}
      {/*   /!* TODO(keegan): navbar we may need: edit round, start tournament, download/share stats,  *!/ */}
      {/*   /!* <Container> *!/ */}
      {/*     <BootstrapNavbar.Brand */}
      {/*       as={Link} */}
      {/*       to={authenticated ? `group/${groupPk}` : ''} */}
      {/*     > */}
      {/*       <img */}
      {/*         alt="" */}
      {/*         src={ */}
      {/*           authenticated */}
      {/*             ? groupImageUrl */}
      {/*             : `${process.env.PUBLIC_URL}/img/logo_outline.png` */}
      {/*         } */}
      {/*         width="30" */}
      {/*         height="30" */}
      {/*         className="d-inline-block align-top" */}
      {/*       />{' '} */}
      {/*       {authenticated ? groupName : 'Game Board'} */}
      {/*     </BootstrapNavbar.Brand> */}
      {/*     <Nav className="me-auto"> */}
      {/*       {!authenticated && ( */}
      {/*         <Nav.Link as={Link} to="/current"> */}
      {/*           Current Standings */}
      {/*         </Nav.Link> */}
      {/*       )} */}
      {/*       {authenticated && ( */}
      {/*         <Nav.Link as={Link} to="/tournament"> */}
      {/*           Tournaments */}
      {/*         </Nav.Link> */}
      {/*       )} */}
      {/*       {authenticated && ( */}
      {/*         <Nav.Link as={Link} to="/add_round"> */}
      {/*           Add Round */}
      {/*         </Nav.Link> */}
      {/*       )} */}
      {/*     </Nav> */}
      {/*     <Nav className="mr-auto"> */}
      {/*       /!* TODO add link to profile page, hide under user image *!/ */}
      {/*       {authenticated ? ( */}
      {/*         <Nav.Link as={Link} to="/logout"> */}
      {/*           Logout */}
      {/*         </Nav.Link> */}
      {/*       ) : ( */}
      {/*         <> */}
      {/*           <Nav.Link as={Link} to="/login"> */}
      {/*             Login */}
      {/*           </Nav.Link> */}
      {/*           /!* <Nav.Link as={Link} to="/signup"> *!/ */}
      {/*           /!*   Signup *!/ */}
      {/*           /!* </Nav.Link> *!/ */}
      {/*         </> */}
      {/*       )} */}
      {/*     </Nav> */}
      {/*   /!* </Container> *!/ */}
      {/*   /!* </BootstrapNavbar> *!/ */}
      {/* </div> */}
    </AuthContext.Provider>
  )
}
