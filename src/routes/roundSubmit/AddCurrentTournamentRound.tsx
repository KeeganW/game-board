import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import {
  useGetGame,
  useGetTournamentMatch,
  useGetTournamentPlayers,
  useGetTournamentSchedule,
  useGetTournamentTeamColors,
  useGetTournamentTeamPlayers,
} from 'src/utils/hooks'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { useForm } from '@mantine/form'
import QRCode from 'react-qr-code'
import { Center, Title } from '@mantine/core'
import { BracketMatchesObject, PlayerRankObject } from 'src/types'
import { RoundDisplay } from 'src/components/RoundDisplay'
import { notifications } from '@mantine/notifications'
import {
  getTeamColorsMap,
  isStillLoading,
  SMALL_WIDTH,
} from 'src/utils/helpers'

export const AddCurrentTournamentRound: React.FC<{
  tournamentPk: string
  matchPk: string
  submitterType: string
}> = ({ tournamentPk, matchPk, submitterType }) => {
  const [roundAdded, setRoundAdded] = useState<number>(-1)
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
  const tournamentMatchResponse = useGetTournamentMatch(matchPk)
  const tournamentMatch = tournamentMatchResponse.response?.data

  // Let's get the relevant match and its info
  const match: BracketMatchesObject = tournamentMatch?.[matchPk] || {}
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
      submitter: '',
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

  const players = playersResponse.response.data[tournamentPk]
  const groupPlayers = playersResponse.response.data.group
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

  if (roundAdded && roundAdded >= 0) {
    // TODO(keegan): provide a link to round (`/round/${roundAdded}`), and a link to tournament
    return (
      <CenteredPage>
        <Title m="lg">
          Please have everyone at the table submit their sportsmanship scores!
        </Title>
        <QRCode
          value={`https://keeganw.github.io/game-board/#/acr/${tournamentPk}/${matchPk}/a`}
        />
      </CenteredPage>
    )
  }
  if (submitterType === 'h') {
    return (
      <CenteredPage pageWidth={SMALL_WIDTH}>
        <Form
          onSubmit={form.onSubmit((values: any) =>
            handleOnSubmit({
              ...values,
              tournamentPk,
              matchPk,
              submitterType,
            })
          )}
        >
          <RoundForm
            form={form}
            gameOptions={games}
            playerOptions={groupPlayers}
            targetPlayerOptions={players}
            teamOptions={teams}
            matchPk={matchPk}
            playerValidations={playerValidations}
            tournamentTeamPlayers={tournamentTeamPlayers}
            tournamentSchedule={tournamentSchedule}
            hideRanksSubmission
            hideScheduledTeamsSubmission
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
  if (match?.round?.playerRanks?.length === 0) {
    return (
      <CenteredPage pageWidth={SMALL_WIDTH}>
        <Title>Please wait for the host to submit scores</Title>
      </CenteredPage>
    )
  }
  return (
    <CenteredPage pageWidth={SMALL_WIDTH}>
      <Title>Please validate the following scores</Title>
      <RoundDisplay
        roundObject={match?.round}
        teamColorMapping={teamToColorMapping}
      />
      <Form
        onSubmit={form.onSubmit((values: any) =>
          handleOnSubmit({
            ...values,
            tournamentPk,
            matchPk,
            submitterType,
          })
        )}
      >
        <RoundForm
          form={form}
          gameOptions={games}
          playerOptions={groupPlayers}
          targetPlayerOptions={players}
          teamOptions={teams}
          matchPk={matchPk}
          playerValidations={playerValidations}
          tournamentTeamPlayers={tournamentTeamPlayers}
          tournamentSchedule={tournamentSchedule}
          hideInstructions
          hideSubstituteWarning
          hideGameSubmission
          hideDateSubmission
          hidePlayersSubmission
          hideRanksSubmission
          hideScoresSubmission
          hideRepresentingSubmission
          hideScheduledTeamsSubmission
        />
        <Center>
          <Button variant="primary" type="submit">
            Validate Scores
          </Button>
        </Center>
      </Form>
    </CenteredPage>
  )
}
