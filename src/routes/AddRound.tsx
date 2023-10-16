import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { Navigate } from 'react-router-dom'
import { useGetGame, useGetPlayer, useUpdatePlayerInfo } from 'src/utils/hooks'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { useForm } from '@mantine/form'
import { SMALL_WIDTH } from 'src/utils/helpers'

export const AddRound: React.FC = () => {
  useUpdatePlayerInfo()

  const form = useForm({
    initialValues: {
      game: '',
      date: new Date(),
      players: [],
    },
  })
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
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (playersResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const players = playersResponse.response.data
  const games = gamesResponse.response.data
  // Good resource
  // https://medium.com/swlh/django-rest-framework-and-spa-session-authentication-with-docker-and-nginx-aa64871f29cd
  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_round/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setRoundAdded(res.data.pk)
      })
      .catch(() => {
        // TODO handle incorrect credentials
      })
  }

  return (
    <CenteredPage pageWidth={SMALL_WIDTH}>
      <Form onSubmit={form.onSubmit((values: any) => handleOnSubmit(values))}>
        <RoundForm form={form} gameOptions={games} playerOptions={players} />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* Redirect away when round is properly submitted */}
      {roundAdded &&
        roundAdded >= 0 &&
        (roundAdded >= 0 ? (
          <Navigate replace to={`/round/${roundAdded}`} />
        ) : (
          <Navigate replace to="/round/" />
        ))}
    </CenteredPage>
  )
}
