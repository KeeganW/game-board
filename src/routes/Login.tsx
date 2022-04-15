import React, { useEffect, useState } from 'react'
import { Button, Form, Stack } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import axios from 'src/axiosAuth'

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios.get('http://localhost:8000/set-csrf/').then(res => console.log(res))
    // TODO need to await for above to finish
    axios.post('http://localhost:8000/login/', data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(res => console.log(res)).catch(res => console.log({res}))

    // Route to main logged in page
    // TODO
  };

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center" style={{width: "300px"}}>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" placeholder="Enter username" {...register("username", { required: true })}/>
            <Form.Text className="text-muted">
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" {...register("password", { required: true })} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </main>
    </Stack>
  )
}
