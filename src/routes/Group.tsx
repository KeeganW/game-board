import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  useGetGroup,
  useGetPlayer,
  useGetRecentRounds,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { capitalizeString, useParamsPk } from 'src/utils/helpers'
import { Row } from 'react-bootstrap'
import { PlayerObjectFull, RoundObject } from 'src/types'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { StackedPage } from 'src/components/StackedPage'
import { RoundDisplay } from 'src/components/RoundDisplay'
import { BasicList } from 'src/components/BasicList'

export const Group: React.FC = () => {
  useUpdatePlayerInfo()
  const paramsPk = useParamsPk()
  const groupResponse = useGetGroup(paramsPk)
  const playerResponse = useGetPlayer()
  const recentRoundsResponse = useGetRecentRounds(paramsPk)

  // Only show the page if things are still loading
  if (
    !groupResponse.response ||
    !groupResponse.response.data ||
    groupResponse.loading ||
    !playerResponse.response ||
    !playerResponse.response.data ||
    playerResponse.loading ||
    !recentRoundsResponse.response ||
    !recentRoundsResponse.response.data ||
    recentRoundsResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (groupResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const group = groupResponse.response.data
  // TODO(keegan): create group specific username request
  const players = playerResponse.response.data
  const groupPlayers = players.filter((player: PlayerObjectFull) =>
    group.players.includes(player.pk)
  )
  const recentRounds = recentRoundsResponse.response.data
  const roundsDisplay = recentRounds.recentRounds.map(
    (roundObject: RoundObject) => <RoundDisplay roundObject={roundObject} />
  )

  return (
    <StackedPage gap={5}>
      <h1>{group.name}</h1>
      <Row>
        <h4>Recent Rounds</h4>
        <Row>{roundsDisplay}</Row>
      </Row>
      <Row>
        <h4>Players</h4>
        <BasicList
          listObject={groupPlayers}
          prefix="/player/"
          alternateDisplay={(player: any) =>
            `${capitalizeString(player.firstName)} ${capitalizeString(
              player.lastName
            )} (${player.username})`
          }
        />
      </Row>
    </StackedPage>
  )
}
