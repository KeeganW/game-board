import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import axios from 'src/axiosAuth'
import { Navigate, useParams } from 'react-router-dom'
import {
  useGetGame,
  useGetPlayer,
  useGetPlayerRank,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { Typeahead } from 'react-bootstrap-typeahead'
import {
  GameObject,
  PlayerObjectLite,
  PlayerRankObjectLite,
  RoundObjectLite,
} from 'src/types'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage, Loading } from 'src/utils/helpers'
import { getTokens } from 'src/utils/localStorageService'

export const AddMatch: React.FC = () => {
  useUpdatePlayerInfo()
  const authToken = getTokens()

  const playersResponse = useGetPlayer()
  const gamesResponse = useGetGame()
  const playerRanksResponse = useGetPlayerRank()

  const { register, handleSubmit, control } = useForm()
  const [addRoundData, setAddRoundData] = useState<
    RoundObjectLite[] | undefined
  >(undefined)
  const [addNewRound, setAddNewRound] = useState<boolean>(false)
  const [matchAdded, setMatchAdded] = useState<number>(-1)

  // Get player info if provided
  const params = useParams()
  const { tournamentPk, match } = params
  const paramsPk = tournamentPk || ''
  const matchNumber = match || ''

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
  }, [paramsPk, matchNumber])

  if (
    !playersResponse.response ||
    !playersResponse.response.data ||
    playersResponse.loading ||
    !gamesResponse.response ||
    !gamesResponse.response.data ||
    gamesResponse.loading ||
    !playerRanksResponse.response ||
    !playerRanksResponse.response.data ||
    playerRanksResponse.loading
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
  const playerRanks = playerRanksResponse.response.data

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

  if (!paramsPk) {
    return <div>Please find this page through your associated tournament.</div>
  }
  return (
    <CenteredPage pageWidth={300}>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="match">
              <Form.Label>Match</Form.Label>
              <Form.Control
                type="text"
                {...register('match', { required: true, value: match })}
              />
              <Form.Text className="text-muted" />
            </Form.Group>

            <Form.Control
              type="hidden"
              {...register('tournament', {
                required: true,
                value: tournamentPk,
              })}
            />

            <Form.Group className="mb-3" controlId="teamGame">
              <Form.Label>Team Game</Form.Label>
              <Form.Check
                className=""
                id="teamGame"
                {...register('teamGame', {})}
              />
            </Form.Group>
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
              <Controller
                control={control}
                name="round"
                rules={{
                  required: 'Please, select at least one Round input value',
                }}
                render={({ field, fieldState }) => (
                  <div className="mb-3">
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="round" className="form-label">
                      Round
                    </label>
                    <Typeahead
                      {...field}
                      id="round"
                      clearButton
                      className={fieldState.invalid ? 'is-invalid' : ''}
                      aria-describedby="gameError"
                      options={
                        addRoundData
                          ?.map((round: RoundObjectLite) => {
                            // TODO: move this offline...
                            const game = games.filter(
                              (thisGame: GameObject) =>
                                round.game === thisGame.pk
                            )?.[0]
                            // Need to get a list of player usernames, by mapping round player
                            //  ranks -> player rank player -> players username
                            const playerList = round.playerRanks.map(
                              (playerRankPk: number) => {
                                // Get the player rank that matches this one
                                const playerRank = playerRanks.filter(
                                  (thisPlayerRank: PlayerRankObjectLite) =>
                                    thisPlayerRank.pk === playerRankPk
                                )?.[0]
                                if (playerRank) {
                                  // PlayerRank exists, so lets map it to a player.
                                  return (
                                    players.filter(
                                      (player: PlayerObjectLite) =>
                                        playerRank.player === player.pk
                                    )?.[0]?.username || 'unknown'
                                  )
                                }
                                return 'unknown'
                              }
                            )
                            return {
                              label: `${game.name} - ${
                                round.date
                              }: \n${playerList.join(', ')}`,
                              value: String(round.pk),
                            }
                          })
                          .reverse() || []
                      }
                    />
                    <p id="gameError" className="invalid-feedback">
                      {fieldState.error?.message}
                    </p>
                  </div>
                )}
              />
            </Col>
          )}

          {addNewRound && (
            <Col>
              <RoundForm
                control={control}
                register={register}
                gameOptions={games}
                playerOptions={players}
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
