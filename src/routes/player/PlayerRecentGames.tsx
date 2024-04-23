import React from 'react'
import { PlayerStats, RoundObject } from 'src/types'
import { Flex } from '@mantine/core'
import { RoundDisplay } from 'src/components/RoundDisplay'

export const PlayerRecentGames: React.FC<{
  playerStatsInfo: PlayerStats
  playerPk: number
}> = ({ playerStatsInfo, playerPk }) => (
  <>
    <h4>Last {playerStatsInfo.lastGamesPlayed.length} Games Played</h4>
    <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
      {playerStatsInfo.lastGamesPlayed.map((round: RoundObject) => (
        <RoundDisplay
          key={`round${round.pk}`}
          roundObject={round}
          highlightPlayerPk={playerPk}
        />
      ))}
    </Flex>
  </>
)
