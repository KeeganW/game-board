import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  BasicList,
  CenteredPage,
  Loading,
  useParamsPk,
} from 'src/utils/helpers'
import {
  useGetTournament,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { TournamentDetails } from './TournamentDetails'

export const Tournament: React.FC = () => {
  useUpdatePlayerInfo()
  const tournamentPk = useParamsPk()

  const tournament = useGetTournament(tournamentPk)

  if (
    !tournament.response ||
    !tournament.response.data ||
    tournament.loading
  ) {
    return (
      <CenteredPage>
        <Loading/>
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (tournament.response.status === 401) {
    return <Navigate replace to="/logout/"/>
  }

  const tournamentInfo = tournament.response.data

  if (!tournamentPk) {
    return (
      <CenteredPage>
        <BasicList
          listObject={[
            ...(tournamentInfo || []),
            // Add this in, so that we can also add a new tournament if we want here.
            {pk: '/add_tournament', name: 'Add Tournament'},
          ]}
        />
      </CenteredPage>
    )
  } else {
    return (
      <CenteredPage>
        <TournamentDetails />
      </CenteredPage>
    )
  }
}
