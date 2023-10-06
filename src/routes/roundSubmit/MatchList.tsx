import React from 'react'
import { useGetTournamentSchedule } from 'src/utils/hooks'
import { Loading } from 'src/components/Loading'
import { BasicList } from 'src/components/BasicList'
import { BracketMatchesObject, BracketMatchesObjectExposed } from 'src/types'
import { isStillLoading } from 'src/utils/helpers'
import moment from 'moment/moment'
import { isArray } from 'lodash'

export const MatchList: React.FC<{
  // Filters for the match list
  tournamentPk?: string
  // Items for changing the display in the list view
  prefix?: string
  addMatchOption?: string
}> = ({ tournamentPk, prefix, addMatchOption }) => {
  const tournamentScheduleResponse = useGetTournamentSchedule(tournamentPk, {
    completed: false,
  })

  if (isStillLoading([tournamentScheduleResponse])) {
    return <Loading />
  }

  const tournamentSchedule = tournamentScheduleResponse.response.data
  delete tournamentSchedule.detail

  const matchList: any[] = []
  Object.entries(tournamentSchedule).forEach(
    (aTournamentSchedule: [string, any]) => {
      aTournamentSchedule[1].forEach((week: string[][]) => {
        if (week && week.length > 0) {
          const firstRound = (week[0] as any).round
          if (
            firstRound &&
            moment(firstRound.date) < moment().add(5, 'days') &&
            moment(firstRound.date) > moment().subtract(2, 'days')
          ) {
            week.forEach((match: string[]) => {
              const matchObject =
                match as unknown as BracketMatchesObjectExposed
              if (!isArray(match)) {
                matchList.push(matchObject)
              }
            })
          }
        }
        return undefined
      })
    }
  )

  return (
    <BasicList
      prefix={prefix}
      listObject={[
        ...(matchList || []),
        // Add this in, so that we can also add a new tournament if we want here.
        ...(addMatchOption ? [{ pk: '/add_match', name: 'Add Match' }] : []),
      ]}
      alternateDisplay={(bracketMatch: BracketMatchesObject) =>
        bracketMatch.round.game.name
      }
    />
  )
}
