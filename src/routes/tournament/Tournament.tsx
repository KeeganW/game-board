import React from 'react'
import { Navigate } from 'react-router-dom'
import { useParamsPk } from 'src/utils/helpers'
import { useGetTournament, useUpdatePlayerInfo } from 'src/utils/hooks'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { BasicList } from 'src/components/BasicList'
import { TournamentDetails } from './TournamentDetails'

export const Tournament: React.FC = () => {
  useUpdatePlayerInfo()
  const tournamentPk = useParamsPk()

  const allTournamentsResponse = useGetTournament()

  if (
    !allTournamentsResponse.response ||
    !allTournamentsResponse.response.data ||
    allTournamentsResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (allTournamentsResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const allTournaments = allTournamentsResponse.response.data

  if (!tournamentPk) {
    return (
      <CenteredPage>
        <BasicList
          listObject={[
            ...(allTournaments || []),
            // Add this in, so that we can also add a new tournament if we want here.
            { pk: '/add_tournament', name: 'Add Tournament' },
          ]}
        />
      </CenteredPage>
    )
  }
  return (
    <CenteredPage>
      <TournamentDetails />
    </CenteredPage>
  )
}
