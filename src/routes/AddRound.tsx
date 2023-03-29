import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { useForm, Controller, ControllerFieldState } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { useGetGame, useGetPlayer, useUpdatePlayerInfo } from 'src/utils/hooks'
import { Typeahead } from 'react-bootstrap-typeahead'
import { AddRoundInfo } from 'src/types'
import { RoundForm } from '../forms/RoundForm'
import { CenteredPage, Loading } from '../utils/helpers'

function NewType(props: { field: any, fieldState: ControllerFieldState }) {
  const {field, fieldState} = props
  console.log(field)
  console.log(fieldState)
  return null
}

export const AddRound: React.FC = () => {
  useUpdatePlayerInfo()

  const { register, handleSubmit, control, formState: { errors } } = useForm()
  const [roundAdded, setRoundAdded] = useState<number>(-1)

  const playersResponse = useGetPlayer()
  const gamesResponse = useGetGame()

  if (
    !playersResponse.response ||
    !playersResponse.response.data ||
    playersResponse.loading ||
    !gamesResponse.response ||
    !gamesResponse.response.data ||
    gamesResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading/>
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (playersResponse.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const players = playersResponse.response.data
  const games = gamesResponse.response.data
  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    // TODO: validate data
    // Get our objects
    axios.get('http://localhost:8000/set-csrf/').then((res) => {
      axios.post('http://localhost:8000/add_round/', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((res) => {
        // Player was logged in, we should have credentials, so redirect
        setRoundAdded(res.data['pk'])
      }).catch((res) => {
        // TODO handle incorrect credentials
      })
    }).catch((res) => {
      // TODO handle error of unable to get csrf token
    })
  }

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center" style={{ width: '300px' }}>
        <Form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* https://github.com/react-hook-form/react-hook-form/discussions/2624 */}
          <RoundForm control={control} register={register} gameOptions={games} playerOptions={players} />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* Redirect away when round is properly submitted */}
        {roundAdded && (roundAdded >= 0 && (roundAdded >= 0 ? <Navigate replace to={`/round/${roundAdded}`} /> : <Navigate replace to="/round/" />))}
      </main>
    </Stack>
  )
}
