import React, { useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { CenteredPage } from 'src/components/CenteredPage'

export const Signup: React.FC = () => {
  const { register, handleSubmit } = useForm()
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
      .get('/set-csrf/')
      .then(() => {
        axios
          .post('/signup/', data, {})
          .then(res => {
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

        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            {...register('first_name', { required: true })}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            {...register('last_name', { required: true })}
          />
          <Form.Text className="text-muted" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="Date of Birth"
            {...register('date_of_birth', { required: true })}
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

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register('confirm_password', { required: true })}
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
