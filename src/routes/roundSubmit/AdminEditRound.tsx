import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import {
  useGetAdminTournamentMatch,
  useGetGame,
  useGetTournamentPlayers,
  useGetTournamentSchedule,
  useGetTournamentTeamColors,
  useGetTournamentTeamPlayers,
} from 'src/utils/hooks'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { useForm } from '@mantine/form'
import { Center } from '@mantine/core'
import {
  BracketMatchesObject,
  PlayerRankObject,
  TeamObjectExposed,
} from 'src/types'
import { notifications } from '@mantine/notifications'
import {
  getTeamColorsMap,
  isStillLoading,
  SMALL_WIDTH,
} from 'src/utils/helpers'
import { useNavigate } from 'react-router-dom'

export const AdminEditRound: React.FC<{
  tournamentPk: string
  matchNumber: string
}> = ({ tournamentPk, matchNumber }) => {
  const [, setRoundAdded] = useState<number>(-1)
  const navigate = useNavigate()
  // TODO(keegan): tournament setting for only a single point of honor
  //  Add this to round form:
  //   Did you enjoy this game? Thumbs up, Thumbs down
  //   On thumbs down, a text box offering "Please leave any feedback you have :)
  //  Add this to round form:
  //   Checkbox for no scores, only winners
  //   Changes form to be "please select winners"

  // Get list of all games and players
  const playersResponse = useGetTournamentPlayers(tournamentPk)
  const gamesResponse = useGetGame()

  // Lets get other relevant info
  const tournamentTeamPlayersResponse =
    useGetTournamentTeamPlayers(tournamentPk)
  const tournamentScheduleResponse = useGetTournamentSchedule(tournamentPk, {
    completed: false,
  })
  const tournamentTeamColorsResponse = useGetTournamentTeamColors(tournamentPk)

  // Then, let's get the tournament and match information for this current instance
  const tournamentMatchResponse = useGetAdminTournamentMatch(
    tournamentPk,
    matchNumber
  )
  const tournamentMatch = tournamentMatchResponse.response?.data

  // Let's get the relevant match and its info
  const match: BracketMatchesObject = tournamentMatch?.[matchNumber] || {}
  const matchPk = match?.pk
  const playerRanks: PlayerRankObject[] = match?.round?.playerRanks

  // Get the current scores and ranks
  const playerScores: any = {}
  const playerValidations: any = {}
  const playerRankRanks: any = {}
  const playerRankRepresenting: any = {}
  playerRanks?.forEach((value: PlayerRankObject) => {
    playerScores[`score-input-${value.player.username}`] = value.score
    playerValidations[value.player.username] = value.validated
    playerRankRanks[`rank-input-${value.player.username}`] = value.rank
    playerRankRepresenting[`representing-input-${value.player.username}`] =
      value.representing?.name
  })

  // Create an object with all our initial values, or defaults
  const initialValues = {
    initialValues: {
      game: match?.round?.game?.name || '',
      date: match?.round?.date ? new Date(match?.round?.date) : new Date(),
      players:
        match?.round?.playerRanks.map(
          (value: PlayerRankObject) => value.player.username
        ) || [],
      scheduledTeams:
        match?.round?.scheduledTeams?.map(
          (value: TeamObjectExposed) => value.name
        ) || [],
      hostTeam: match?.round?.hostTeam?.name || '',
      submitter: 'h',
      ...playerScores,
      ...playerRankRanks,
      ...playerRankRepresenting,
    },
  }

  // Setup the form with the initial values we found
  const form = useForm(initialValues)
  // Create a hook to update the form when the match finally loads
  useEffect(() => {
    form.setValues(initialValues.initialValues)
    // form.setInitialValues(initialValues.initialValues)
  }, [tournamentMatch])

  if (
    isStillLoading([
      playersResponse,
      gamesResponse,
      tournamentTeamPlayersResponse,
      tournamentMatchResponse,
      tournamentScheduleResponse,
      tournamentTeamColorsResponse,
    ])
  ) {
    return <Loading />
  }

  // TODO(keegan): this should be all players from group
  const players = playersResponse.response.data[tournamentPk]
  const games = gamesResponse.response.data
  const tournamentTeamPlayers =
    tournamentTeamPlayersResponse.response.data[tournamentPk]
  const tournamentSchedule =
    tournamentScheduleResponse.response.data[tournamentPk]
  const tournamentTeamColors =
    tournamentTeamColorsResponse.response.data[tournamentPk]
  const teamToColorMapping = getTeamColorsMap(tournamentTeamColors)
  const teams = Array.from(teamToColorMapping.keys())

  const handleOnSubmit = (data: any) => {
    // Get our objects
    axios
      .post('/add_round/', data, {})
      .then(res => {
        // Player was logged in, we should have credentials, so redirect
        setRoundAdded(res.data.pk)
        navigate(-1)
      })
      .catch(res => {
        notifications.show({
          color: 'red',
          title: 'Submission Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            res.response.data?.errors?.__all__ ||
            'Error submitting this round.',
        })
      })
  }

  return (
    <CenteredPage pageWidth={SMALL_WIDTH}>
      <Form
        onSubmit={form.onSubmit((values: any) =>
          handleOnSubmit({
            ...values,
            tournamentPk,
            matchPk,
          })
        )}
      >
        <RoundForm
          form={form}
          gameOptions={games}
          playerOptions={players}
          teamOptions={teams}
          matchPk={matchPk}
          playerValidations={playerValidations}
          tournamentTeamPlayers={tournamentTeamPlayers}
          tournamentSchedule={tournamentSchedule}
          hideRanksSubmission
        />
        <Center>
          <Button variant="primary" type="submit">
            Submit Scores
          </Button>
        </Center>
      </Form>
    </CenteredPage>
  )
}
