import React from 'react'
import { useGetTournamentNames } from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import { BasicList } from 'src/components/BasicList'
import { isStillLoading } from 'src/utils/helpers'

export const TournamentList: React.FC<{
  prefix?: string
  addTournamentOption?: boolean
  showCompleted?: boolean
}> = ({ prefix, addTournamentOption, showCompleted }) => {
  const completedParams: any = showCompleted ? undefined : { completed: false }
  const allTournamentsResponse = useGetTournamentNames('', completedParams)

  if (isStillLoading([allTournamentsResponse])) {
    return <Loading />
  }

  const allTournaments = allTournamentsResponse.response.data.names

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
