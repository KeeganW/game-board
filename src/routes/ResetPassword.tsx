import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'
import { Center, PasswordInput, TextInput, Title } from '@mantine/core'
import { SMALL_WIDTH } from 'src/utils/helpers'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'

export const ResetPassword: React.FC = () => {
  const [passwordResetSent, setPasswordResetSent] = useState<boolean>(false)

  const params = useParams()
  const { username, token } = params
  const usernameSafe = username || ''
  const tokenSafe = token || ''

  const initialValues = {
    initialValues: {
      username: usernameSafe,
      reset_token: tokenSafe !== '' ? tokenSafe : undefined,
    },
  }
  const form = useForm(initialValues)
  useEffect(() => {
    form.setValues(initialValues.initialValues)
  }, [params])

  const handleOnSubmit = (data: any) => {
    axios
      .post('/reset_password/', data, {})
      .then(() => {
        // User has reset password
        setPasswordResetSent(true)
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Submission Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ ||
            'Error resetting your password.',
        })
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
        <Form onSubmit={form.onSubmit((values: any) => handleOnSubmit(values))}>
          <TextInput
            id="username"
            // Hiding this breaks mantine form things, so don't actually hide it, use this hack
            style={{ visibility: 'hidden', position: 'absolute' }}
            {...form.getInputProps('username')}
          />
          <TextInput
            id="reset_token"
            // Hiding this breaks mantine form things, so don't actually hide it, use this hack
            style={{ visibility: 'hidden', position: 'absolute' }}
            {...form.getInputProps('reset_token')}
          />

          <PasswordInput
            id="new_password"
            label="New Password"
            placeholder="New Password"
            {...form.getInputProps('new_password')}
          />

          <PasswordInput
            id="confirm_password"
            label="Confirm Password"
            placeholder="Confirm Password"
            {...form.getInputProps('confirm_password')}
          />
          <Center>
            <Button variant="primary" type="submit">
              Reset
            </Button>
          </Center>
        </Form>
      </CenteredPage>
    )
  }
  if (passwordResetSent) {
    return (
      <CenteredPage pageWidth={SMALL_WIDTH}>
        <Title order={2}>
          Please ask @0mni on discord for the password reset link!
        </Title>
      </CenteredPage>
    )
  }
  return (
    <CenteredPage pageWidth={SMALL_WIDTH}>
      <Title order={2}>Find your Account</Title>
      <p>
        Please provide the username of your account, so a reset link can be
        provided to you.
      </p>
      <Form onSubmit={form.onSubmit((values: any) => handleOnSubmit(values))}>
        <TextInput
          id="username"
          label="Username"
          {...form.getInputProps('username')}
        />
        <Center>
          <Button variant="primary" type="submit">
            Reset
          </Button>
        </Center>
      </Form>
    </CenteredPage>
  )
}
