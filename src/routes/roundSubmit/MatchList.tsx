import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGetTournamentMatches } from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import { BasicList } from 'src/components/BasicList'
import { Moment } from 'moment'
import { BracketMatchesObject } from 'src/types'

export const MatchList: React.FC<{
  // Filters for the match list
  tournamentPk?: string
  dateStart?: Moment
  dateEnd?: Moment
  // Items for changing the display in the list view
  prefix?: string
  addMatchOption?: string
}> = ({ tournamentPk, dateStart, dateEnd, prefix, addMatchOption }) => {
  // TODO(keegan): pass filters back through the request
  const allMatchesResponse = useGetTournamentMatches(tournamentPk, {
    dateStart: dateStart?.format('YYYY-MM-DD'),
    dateEnd: dateEnd?.format('YYYY-MM-DD'),
  })

  if (
    !allMatchesResponse.response ||
    !allMatchesResponse.response.data ||
    allMatchesResponse.loading
  ) {
    return <Loading />
  }
  // Catch weird instances where we need to log out
  if (allMatchesResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const allMatches = allMatchesResponse.response.data.tournamentMatches

  return (
    <BasicList
      prefix={prefix}
      listObject={[
        ...(allMatches || []),
        // Add this in, so that we can also add a new tournament if we want here.
        ...(addMatchOption ? [{ pk: '/add_match', name: 'Add Match' }] : []),
      ]}
      alternateDisplay={(bracketMatch: BracketMatchesObject) =>
        bracketMatch.round.game.name
      }
    />
  )
}
