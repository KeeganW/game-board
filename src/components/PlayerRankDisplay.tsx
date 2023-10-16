import React from 'react'
import { Link } from 'react-router-dom'
import { ThemeIcon } from '@mantine/core'
import { PlayerRankObject } from 'src/types'
import { HoverTooltip } from 'src/components/HoverTooltip'
import { rankToScoreMap } from 'src/utils/helpers'
import { RowDisplay } from 'src/components/RowDisplay'

export const PlayerRankDisplay: React.FC<{
  playerRankObject: PlayerRankObject
  teamColorMapping?: Map<number | string, string>
  showTournamentScores?: boolean
  modifiedScoring?: boolean
  teamGame?: boolean
  useUsernames?: boolean
  usePlayer?: boolean
  isSchedule?: boolean
}> = ({
  playerRankObject,
  teamColorMapping,
  showTournamentScores,
  modifiedScoring,
  teamGame,
  useUsernames,
  usePlayer,
  isSchedule,
}) => {
  // Get values we need
  const playerColor = teamColorMapping?.get(playerRankObject.representing?.name)
  let tooltip = `Base Score for Rank (${
    rankToScoreMap[playerRankObject.rank]
  }) + Player's Handicap (${playerRankObject.tournamentHandicap}) - Rank (${
    playerRankObject.rank
  })`
  let points = (
    rankToScoreMap[playerRankObject.rank] +
    playerRankObject.tournamentHandicap -
    playerRankObject.rank
  ).toFixed(1)
  if (teamGame) {
    tooltip = `Base Score for Rank (${rankToScoreMap[playerRankObject.rank]})`
    points = `${rankToScoreMap[playerRankObject.rank]}`
  }
  if (modifiedScoring) {
    tooltip = `( ${tooltip} ) * Modified Scoring (2)`
    points = (Number(points) * 2).toFixed(1)
  }

  // Make a decision on what we are displaying
  const useUsernamesName = useUsernames
    ? playerRankObject.player.username
    : `${playerRankObject.player.firstName} ${playerRankObject.player.lastName}`
  if (isSchedule) {
    return (
      <RowDisplay
        rank={undefined}
        player={
          <span>
            {playerRankObject.representing ? (
              <HoverTooltip
                tooltip={playerRankObject.representing?.name}
                text={
                  <ThemeIcon size="xs" mr="xs" mb="-3px" color={playerColor} />
                }
              />
            ) : undefined}
            <Link
              to={`/player/${playerRankObject.player.pk}`}
              style={{ color: 'black', textDecoration: 'none' }}
            >
              {usePlayer ? playerRankObject.player : useUsernamesName}
            </Link>
          </span>
        }
        score={undefined}
      />
    )
  }
  return (
    <RowDisplay
      rank={
        <span style={{ fontWeight: 'bold' }}>
          <HoverTooltip
            tooltip={playerRankObject.score}
            text={playerRankObject.rank}
          />
        </span>
      }
      player={
        <span>
          <HoverTooltip
            tooltip={playerRankObject?.representing?.name}
            text={<ThemeIcon size="xs" mr="xs" mb="-3px" color={playerColor} />}
          />
          <Link
            to={`/player/${playerRankObject.player.pk}`}
            style={{ color: 'black', textDecoration: 'none' }}
          >
            {usePlayer ? playerRankObject.player : useUsernamesName}
          </Link>
        </span>
      }
      score={
        <span>
          {showTournamentScores ? (
            <HoverTooltip tooltip={tooltip} text={points} />
          ) : (
            playerRankObject.score
          )}
        </span>
      }
    />
  )
}
