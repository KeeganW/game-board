import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGetTournament } from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import { BasicList } from 'src/components/BasicList'

export const TournamentList: React.FC<{
  prefix?: string
  addTournamentOption?: boolean
}> = ({ prefix, addTournamentOption }) => {
  const allTournamentsResponse = useGetTournament()

  if (
    !allTournamentsResponse.response ||
    !allTournamentsResponse.response.data ||
    allTournamentsResponse.loading
  ) {
    return <Loading />
  }
  // Catch weird instances where we need to log out
  if (allTournamentsResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const allTournaments = allTournamentsResponse.response.data

  return (
    <BasicList
      prefix={prefix}
      listObject={[
        ...(allTournaments || []),
        // Add this in, so that we can also add a new tournament if we want here.
        ...(addTournamentOption
          ? [{ pk: '/add_tournament', name: 'Add Tournament' }]
          : []),
      ]}
      reverse
    />
  )
}
