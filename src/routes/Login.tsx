import React, { useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { CenteredPage } from 'src/utils/helpers'

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
  } = useForm()
  const {
    authenticated,
    setAuthenticated,
    playerPk,
    setPlayerPk,
    setGroupPk,
    setGroupImageUrl,
    setGroupName,
  } = useContext(AuthContext)

  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    // TODO: validate data, convert this into a hook
    // Get our objects
    axios
      .get('https://boardgametournaments.com/set-csrf/')
      .then(() => {
        axios
          .post('https://boardgametournaments.com/login/', data, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          })
          .then((res) => {
            // Player was logged in, we should have credentials, so redirect
            setAuthenticated(true)
            setPlayerPk(res.data.playerPk || -1)
            setGroupPk(res.data.groupPk || -1)
            setGroupName(res.data.groupName || '')
            setGroupImageUrl(res.data.groupImageUrl || '')
          })
          .catch(() => {
            // TODO handle incorrect credentials
          })
      })
      .catch(() => {
        // TODO handle error of unable to get csrf token
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
      {authenticated
        && playerPk >= 0
        && (playerPk >= 0 ? (
          <Navigate replace to={`/player/${playerPk}`} />
        ) : (
          <Navigate replace to="/player/" />
        ))}
    </CenteredPage>
  )
}
