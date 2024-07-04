import React, { useState } from 'react'
import {
  useGetTournamentDraft,
  useGetTournamentTeamColors,
} from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import {
  getTeamColorsMap,
  isStillLoading,
  useParamsPk,
} from 'src/utils/helpers'
import { BracketMatchesObject, TeamObject } from 'src/types'
import { RoundDisplay } from 'src/components/RoundDisplay'
import { Button, Flex, Title } from '@mantine/core'
import { CenteredPage } from 'src/components/CenteredPage'
import axios from 'src/axiosAuth'
import { floor } from 'lodash'
import moment from 'moment'
import { notifications } from '@mantine/notifications'

export const Draft: React.FC = () => {
  const tournamentPk = useParamsPk()

  const tournamentTeamColorsResponse = useGetTournamentTeamColors(tournamentPk)
  const tournamentDraftResponse = useGetTournamentDraft(tournamentPk)

  const [refetching, setRefetching] = useState<boolean>(false)

  if (isStillLoading([tournamentTeamColorsResponse])) {
    return <Loading />
  }

  const tournamentTeamColors = tournamentTeamColorsResponse.response.data // Get colors
  const tournamentDraft = tournamentDraftResponse.response?.data // Get draft

  const teamToColorMapping = getTeamColorsMap(
    tournamentTeamColors[tournamentPk]
  )
  const draft = tournamentDraft?.draft
  const validMatchPicks = tournamentDraft?.validMatchPicks
  const drafting = draft?.drafting

  // TODO: Make it so you can click on any one of these, and get taken to /edit_round/<tournamentpk>/match.match
  function draftMatch(match: number) {
    setRefetching(true)
    axios
      .post(`/draft/${tournamentPk}/`, { matchPick: match }, {})
      .then(() => {
        // Player was logged in, we should have credentials, so redirect
        tournamentDraftResponse.sendData()
        setRefetching(false)
      })
      .catch(loginErrorRes => {
        setRefetching(false)
        notifications.show({
          color: 'red',
          title: 'Drafting Error',
          message:
            // eslint-disable-next-line no-underscore-dangle
            loginErrorRes.response.data?.errors?.__all__ ||
            'General error on this page.',
        })
      })
    return undefined
  }

  // TODO: some links to use elsewhere
  // <Link to={`/draft/${tournamentPk}`} style={{textDecoration: "none"}}>
  // <Link to={`/edit_round/${tournamentPk}/${match.match}`} style={{textDecoration: "none"}}>

  const matches = tournamentDraft?.draft.matches.sort(
    (a: BracketMatchesObject, b: BracketMatchesObject) => a.match - b.match
  )
  const numberOfTeams = tournamentDraft?.draft.tournament.bracket.teams.length
  const startingWeek = floor(((matches?.[0]?.match || 1) - 1) / numberOfTeams)

  // Breakout matches into the weeks they are being played in
  const matchesByWeek: BracketMatchesObject[][] = []
  const teamMatchesByWeek: Record<string, number>[] = []
  if (tournamentDraft) {
    tournamentDraft?.draft.matches.forEach((match: BracketMatchesObject) => {
      const matchWeek = floor((match.match - 1) / numberOfTeams)
      const indexWeek = matchWeek - startingWeek
      if (!matchesByWeek[indexWeek]) {
        matchesByWeek[indexWeek] = []
        teamMatchesByWeek[indexWeek] = {}
      }
      matchesByWeek[indexWeek].push(match)
      match.round.scheduledTeams.forEach((team: TeamObject) => {
        teamMatchesByWeek[indexWeek][team.pk] =
          (teamMatchesByWeek[indexWeek][team.pk] || 0) + 1
      })
    })
  }

  const roundsToDisplay = matchesByWeek.map(
    (week: BracketMatchesObject[], weekIndex: number) => {
      const weekDateDisplay =
        week && week.length > 0
          ? moment(week[0].round.date).format('MMMM D, YYYY')
          : ''
      let disabledCount = 0
      const weekDisplay = week?.map((match: BracketMatchesObject) => {
        // Get conditions where we would disable this drafting option
        const validPicksForTeam = validMatchPicks?.[drafting.name]?.[weekIndex + 1] || []
        const matchIsValid = validPicksForTeam.includes(match.match)

        const isGettingData =
          refetching || isStillLoading([tournamentDraftResponse])

        const shouldDisable =
          !matchIsValid ||
          isGettingData
        const pickButton = !shouldDisable && (
          <Button
            size="xs"
            onClick={() => {
              console.log(`Drafting ${match.match}`)
              draftMatch(match.match)
            }}
            disabled={shouldDisable}
          >
            Draft
          </Button>
        )
        disabledCount += shouldDisable ? 1 : 0

        return (
          <RoundDisplay
            roundObject={match.round as any}
            teamColorMapping={teamToColorMapping}
            showTournamentScores={false}
            modifiedScoring={match.modifiedScoring}
            teamGame={match.teamGame}
            action={pickButton}
            usePlayer
            isSchedule
            disabled={shouldDisable}
          />
        )
      })
      return disabledCount === week.length ? null : (
        <>
          <Title order={3}>
            Playoff {weekIndex + 1}{' '}
            {weekDateDisplay ? ` - ${weekDateDisplay}` : ''}
          </Title>
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 'sm', sm: 'lg' }}
            justify={{ sm: 'center' }}
            wrap="wrap"
          >
            {weekDisplay}
          </Flex>
        </>
      )
    }
  )

  return (
    <CenteredPage>
      <div>
        {refetching ? <Loading /> : <Title>Currently Drafting: {drafting?.name}</Title>}
      </div>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'lg' }}
        justify={{ sm: 'center' }}
        wrap="wrap"
      >
        {roundsToDisplay}
      </Flex>
    </CenteredPage>
  )
}
