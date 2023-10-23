import React from 'react'
import { useParamsPk } from 'src/utils/helpers'
import {
  useGetPlayer,
  useGetPlayerStats,
  useUpdatePlayerInfo,
} from 'src/utils/hooks'
import { PlayerTitle } from 'src/routes/player/PlayerTitle'
import { PlayerQuickLook } from 'src/routes/player/PlayerQuickLook'
import { PlayerRecentGames } from 'src/routes/player/PlayerRecentGames'
import { Navigate } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'

export const Player: React.FC = () => {
  useUpdatePlayerInfo()
  const paramsPk = useParamsPk()
  const player = useGetPlayer(paramsPk)
  const playerStats = useGetPlayerStats(paramsPk)

  // Only show the page if things are still loading
  if (
    !player.response ||
    !player.response.data ||
    player.loading ||
    !playerStats.response ||
    !playerStats.response.data ||
    playerStats.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (player.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const playerInfo = player.response.data
  const playerStatsInfo = playerStats.response.data

  return (
    <CenteredPage>
      <PlayerTitle playerInfo={playerInfo} />
      <PlayerQuickLook playerStatsInfo={playerStatsInfo} />
      <PlayerRecentGames
        playerStatsInfo={playerStatsInfo}
        playerPk={playerInfo.pk}
      />
    </CenteredPage>
  )
}
