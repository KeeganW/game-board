import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import { useGetGame, useGetPlayer, useUpdatePlayerInfo } from 'src/utils/hooks'
import { RoundObjectLite } from 'src/types'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage } from 'src/components/CenteredPage'
import { getTokens } from 'src/utils/localStorageService'
import { Loading } from 'src/components/Loading'
import { useForm } from '@mantine/form'
import { Checkbox, NumberInput } from '@mantine/core'

export const AddMatch: React.FC = () => {
  useUpdatePlayerInfo()
  const authToken = getTokens()

  const playersResponse = useGetPlayer()
  const gamesResponse = useGetGame()

  const submitterType = 'h'
  const [, setAddRoundData] = useState<RoundObjectLite[] | undefined>(undefined)
  const [addNewRound, setAddNewRound] = useState<boolean>(false)
  const [matchAdded, setMatchAdded] = useState<number>(-1)

  // Get player info if provided
  const params = useParams()
  const { tournamentPk, matchPk } = params
  const tournamentPkSafe = tournamentPk || ''
  const matchPkSafe = matchPk || ''
  const initialValues = {
    initialValues: {
      game: '',
      date: new Date(),
      players: [],
      teamGame: false,
      match: matchPkSafe,
    },
  }
  const form = useForm(initialValues)
  useEffect(() => {
    form.setValues(initialValues.initialValues)
  }, [params])

  useEffect(() => {
    axios
      .get('/round/', {
        headers: {
          ...(authToken.access && {
            Authorization: `Bearer ${authToken.access}`,
          }),
        },
      })
      .then(res => {
        setAddRoundData(res.data as RoundObjectLite[])
      })
  }, [tournamentPkSafe, matchPkSafe])

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
      .post('/add_match/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setMatchAdded(res.data.pk)
      })
      .catch(() => {
        // TODO handle incorrect credentials
      })
  }

  if (!tournamentPkSafe) {
    return <div>Please find this page through your associated tournament.</div>
  }
  return (
    <CenteredPage pageWidth={300}>
      <Form
        onSubmit={form.onSubmit((values: any) =>
          handleOnSubmit({
            ...values,
            tournamentPk,
            submitterType,
          })
        )}
      >
        <Row>
          <Col>
            <NumberInput
              id="match"
              label="Match Number"
              min={0}
              {...form.getInputProps('match')}
            />

            <Checkbox
              id="teamGame"
              label="Team Game"
              {...form.getInputProps('teamGame')}
            />

            {/*   Team game */}
          </Col>
        </Row>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setAddNewRound(!addNewRound)}
        >
          {addNewRound ? 'Add Match By Round' : 'Add New Round for Match'}
        </Button>
        <Row>
          {!addNewRound && (
            <Col>
              <NumberInput
                id="round"
                label="Round Number"
                min={0}
                {...form.getInputProps('round')}
              />
            </Col>
          )}

          {addNewRound && (
            <Col>
              <RoundForm
                form={form}
                gameOptions={games}
                playerOptions={players}
                hideRanksSubmission
              />
            </Col>
          )}
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {/* If login button stops working randomly, it probably has to do with this statement */}
      {matchAdded &&
        matchAdded >= 0 &&
        (matchAdded >= 0 ? (
          <Navigate replace to={`/tournament/${matchAdded}`} />
        ) : (
          <Navigate replace to="/tournament/" />
        ))}
    </CenteredPage>
  )
}
