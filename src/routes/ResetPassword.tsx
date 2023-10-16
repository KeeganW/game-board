import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'
import { Title } from '@mantine/core'
import { SMALL_WIDTH } from 'src/utils/helpers'

export const ResetPassword: React.FC = () => {
  const { register, handleSubmit } = useForm()
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false)

  const params = useParams()
  const { username, token } = params
  const usernameSafe = username || ''
  const tokenSafe = token || ''

  const handleOnSubmit = (data: any) => {
    axios
      .post('/reset_password/', data, {})
      .then(() => {
        // User has reset password
        setPasswordResetSent(true)
      })
      .catch(() => {
        // TODO handle incorrect credentials
      })
  }

  if (usernameSafe && tokenSafe) {
    if (passwordResetSent) {
      return (
        <CenteredPage pageWidth={SMALL_WIDTH}>
          <Navigate replace to="/login/" />
        </CenteredPage>
      )
    }
    return (
      <CenteredPage pageWidth={SMALL_WIDTH}>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          <Form.Group className="mb-3" controlId="formHidden">
            <Form.Control
              type="hidden"
              {...register('username', { value: usernameSafe })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formHidden">
            <Form.Control
              type="hidden"
              {...register('reset_token', { value: tokenSafe })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              {...register('new_password', { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
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
      </CenteredPage>
    )
  }
  if (passwordResetSent) {
    return (
      <CenteredPage pageWidth={SMALL_WIDTH}>
        <Title>Please ask @0mni on discord for the password reset link!</Title>
      </CenteredPage>
    )
  }
  return (
    <CenteredPage pageWidth={SMALL_WIDTH}>
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </CenteredPage>
  )
}
