import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import {
  useGetGame,
  useGetPlayer,
  useGetTournamentInfo,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { RoundForm } from 'src/forms/RoundForm'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { useForm } from '@mantine/form'
import QRCode from 'react-qr-code'
import { Center, Title } from '@mantine/core'
import { BracketMatchesObject, PlayerRankObject } from 'src/types'
import { RoundDisplay } from 'src/components/RoundDisplay'

export const AddCurrentTournamentRound: React.FC<{
  tournamentPk: string
  matchPk: string
  submitterType: string
}> = ({ tournamentPk, matchPk, submitterType }) => {
  useUpdatePlayerInfo()
  const [roundAdded, setRoundAdded] = useState<number>(-1)

  // Host will see all team names, and be asked to add a player for each team
  // Consider that each team may have a sub, or may be a specific player we already know about
  // Generate QR code once complete for users to submit honor

  // Other people will be offered the game too, if they are not the host, they need to wait for host
  // If host is done, then they see a form that just has the player names and scores, and hearts for honor
  // TODO(keegan): tournament setting for only a single point of honor
  // Submit button at end submits honor + affirms scores

  // Add this to round form:
  // Did you enjoy this game? Thumbs up, Thumbs down
  // On thumbs down, a text box offering "Please leave any feedback you have :)
  // Add this to round form:
  // Checkbox for no scores, only winners
  // Changes form to be "please select winners"

  // Get list of all games and players
  const playersResponse = useGetPlayer()
  const gamesResponse = useGetGame()

  // Then, let's get the tournament and match information for this current instance
  const tournamentInfoResponse = useGetTournamentInfo(tournamentPk)
  const tournamentInfo = tournamentInfoResponse.response?.data?.tournament

  // Let's get the relevant match and its info
  const matchSearch =
    tournamentInfo?.bracket?.matches?.filter(
      (bracketMatch: BracketMatchesObject) =>
        bracketMatch.pk === Number.parseInt(matchPk, 10)
    ) || []
  const match: BracketMatchesObject =
    matchSearch.length > 0 ? matchSearch[0] : {}
  const playerRanks: PlayerRankObject[] = match?.round?.playerRanks

  // Get the current scores and ranks
  const playerScores: any = {}
  const playerRankRanks: any = {}
  playerRanks?.forEach((value: PlayerRankObject) => {
    playerScores[`score-input-${value.player.username}`] = value.score
    playerRankRanks[`rank-input-${value.player.username}`] = value.rank
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
    },
  }

  // Setup the form with the initial values we found
  const form = useForm(initialValues)
  // Create a hook to update the form when the match finally loads
  useEffect(() => {
    form.setValues(initialValues.initialValues)
  }, [tournamentInfo])

  if (
    !tournamentInfoResponse.response ||
    !tournamentInfoResponse.response.data ||
    tournamentInfoResponse.loading ||
    !playersResponse.response ||
    !playersResponse.response.data ||
    playersResponse.loading ||
    !gamesResponse.response ||
    !gamesResponse.response.data ||
    gamesResponse.loading
  ) {
    return <Loading />
  }

  const players = playersResponse.response.data
  const games = gamesResponse.response.data

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

  if (roundAdded && roundAdded >= 0) {
    // TODO(keegan): provide a link to round (`/round/${roundAdded}`), and a link to tournament
    return (
      <CenteredPage pageWidth={600}>
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
      <CenteredPage pageWidth={400}>
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
            playerOptions={players}
            hideRanksSubmission
          />
          <Button variant="primary" type="submit">
            Submit Scores
          </Button>
        </Form>
      </CenteredPage>
    )
  }
  if (match?.round?.playerRanks?.length === 0) {
    return (
      <CenteredPage pageWidth={400}>
        <Title>Please wait for the host to submit scores</Title>
      </CenteredPage>
    )
  }
  return (
    <CenteredPage pageWidth={400}>
      <Title>Please validate the following scores</Title>
      <Center>
        <RoundDisplay roundObject={match?.round} />
      </Center>
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
          playerOptions={players}
          hideInstructions
          hideGameSubmission
          hideDateSubmission
          hidePlayersSubmission
          hideRanksSubmission
          hideScoresSubmission
        />
        <Button variant="primary" type="submit">
          Validate Scores
        </Button>
      </Form>
    </CenteredPage>
  )
}
