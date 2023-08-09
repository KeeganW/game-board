import React, { useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { CenteredPage } from 'src/components/CenteredPage'

export const Login: React.FC = () => {
  const { register, handleSubmit } = useForm()
  const {
    authenticated,
    setAuthenticated,
    setTokenAccess,
    setTokenRefresh,
    playerPk,
    setPlayerPk,
    setGroupPk,
    setGroupImageUrl,
    setGroupName,
  } = useContext(AuthContext)

  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    axios
      .post('/token/login/', data, {})
      .then(tokenResponse => {
        // Player was logged in, we should have credentials, so redirect
        setAuthenticated(true)
        setTokenAccess(tokenResponse.data?.access)
        setTokenRefresh(tokenResponse.data?.refresh)
        localStorage.setItem('tokenAccess', tokenResponse.data?.access)
        localStorage.setItem('tokenRefresh', tokenResponse.data?.refresh)

        axios
          .post('/login/', data, {})
          .then(loginResponse => {
            // Player was logged in, we should have credentials, so redirect
            setPlayerPk(loginResponse.data.playerPk || -1)
            setGroupPk(loginResponse.data.groupPk || -1)
            setGroupName(loginResponse.data.groupName || '')
            setGroupImageUrl(loginResponse.data.groupImageUrl || '')

            // Store this in our local storage for any other tabs that are opened
            localStorage.setItem(
              'initialState',
              JSON.stringify(loginResponse.data)
            )
          })
          .catch(() => {
            // TODO handle incorrect credentials
          })
      })
      .catch(() => {
        // TODO handle incorrect credentials
      })
  }

  return (
    <CenteredPage pageWidth={300}>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            {...register('username', { required: true })}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* Once logged in, go to the logged in player's page. */}
      {authenticated &&
        playerPk >= 0 &&
        (playerPk >= 0 ? (
          <Navigate replace to={`/player/${playerPk}`} />
        ) : (
          <Navigate replace to="/player/" />
        ))}
    </CenteredPage>
  )
}
