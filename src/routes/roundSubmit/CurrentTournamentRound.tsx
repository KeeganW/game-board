import React from 'react'
import { useParams } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'
import { BasicList } from 'src/components/BasicList'
import { Title } from '@mantine/core'
import { AddCurrentTournamentRound } from './AddCurrentTournamentRound'
import { TournamentList } from './TournamentList'
import { MatchList } from './MatchList'

export const CurrentTournamentRound: React.FC = () => {
  // Get current tournaments list, and ask the user to pick one
  // Get current games list for tournament, and ask the user to pick one
  //  Games are limited by the current date.
  // Show list of games to user, ask them to pick one
  // Ask the user whether they are the host or not

  const params = useParams()
  const { tournamentPk, matchPk, submitterType } = params
  const tournamentPkSafe = tournamentPk || ''
  const matchPkSafe = matchPk || ''
  const submitterTypeSafe = submitterType || ''

  if (!tournamentPkSafe) {
    return (
      <CenteredPage>
        <Title>Which tournament are you playing in?</Title>
        <TournamentList />
      </CenteredPage>
    )
  }
  if (!matchPkSafe) {
    return (
      <CenteredPage>
        <Title>Which game did you play?</Title>
        <MatchList
          tournamentPk={tournamentPkSafe}
          prefix={`/acr/${tournamentPkSafe}/`}
        />
      </CenteredPage>
    )
  }
  if (!submitterTypeSafe) {
    return (
      <CenteredPage>
        <Title>Are you the host?</Title>
        <BasicList
          prefix={`/acr/${tournamentPkSafe}/${matchPkSafe}/`}
          listObject={[
            { pk: 'h', name: 'Yes' }, // Home (h) or host team
            { pk: 'a', name: 'No' }, // Away (a) team
          ]}
        />
      </CenteredPage>
    )
  }
  return (
    <CenteredPage>
      <AddCurrentTournamentRound
        tournamentPk={tournamentPkSafe}
        matchPk={matchPkSafe}
        submitterType={submitterTypeSafe}
      />
    </CenteredPage>
  )
}
