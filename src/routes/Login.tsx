import React, { useEffect, useState } from 'react'
import { Button, Form, Stack } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'

type USERNAME_PASSWORD = {
  username: string
  password: string
}

const useFetch = (url: string, options: RequestInit) => {
  const [data, setData] = useState(null)

  // empty array as second argument equivalent to componentDidMount
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url, options)
      const json = await response.json()
      setData(json)
    }
    fetchData()
  }, [])

  return data
}

/**
 *
 * @param data
 */
const createFetchObjects = (data: any) => {
  const url = 'http://localhost:8000/token/'
  const body = data  // TODO we should be validating this data right?
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const requestInfo: RequestInit = {
    headers: headers,
    body: JSON.stringify(data),
    method: "POST",
  }
  return {url, requestInfo}
}
const onSubmit = async (data: any) => {
  // Get our objects
  const { url, requestInfo } = createFetchObjects(data)

  // Send the fetch
  const response = await fetch(url, requestInfo)

  // Get the json
  const json = await response.json()

  // Return the promise to the caller
  return json
};

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleOnSubmit = async (data: any) => {
    // Get our objects
    const json = await onSubmit(data)

    // Store the token for future requests
    console.log(json)

    // Route to main logged in page
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
