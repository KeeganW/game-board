import React from 'react'
import { PlayerStats } from 'src/types'

export const PlayerQuickLook: React.FC<{
  playerStatsInfo: PlayerStats
}> = ({ playerStatsInfo }) => (
  <h5>{playerStatsInfo.numberGamesPlayed} Total Games Played</h5>
)
