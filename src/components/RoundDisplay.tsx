import React, { CSSProperties } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { PlayerRankObject, RoundObject } from '../types'
import { HoverTooltip } from './HoverTooltip'
import { CardDisplay } from './CardDisplay'
import { rankToScoreMap } from '../utils/helpers'

export const RoundDisplay: React.FC<{
  children?: any
  roundObject: RoundObject
  playerColorMapping?: Map<number | string, string>
  showTournamentScores?: boolean
  modifiedScoring?: boolean
  teamGame?: boolean
  useUsernames?: boolean
  usePlayer?: boolean
  isSchedule?: boolean
}> = ({
  children,
  roundObject,
  playerColorMapping,
  showTournamentScores,
  modifiedScoring,
  teamGame,
  useUsernames,
  usePlayer,
  isSchedule,
}) => {
  // Get the players and their scores/ranks listed out
  const roundScores = roundObject.playerRanks
    ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
    .map((playerRankObject: PlayerRankObject) => {
      const playerColor = playerColorMapping?.get(
        playerRankObject.player.pk ||
          (playerRankObject.player as unknown as string)
      )
      let tooltip = `Base Score for Rank (${
        rankToScoreMap[playerRankObject.rank]
      }) + Player's Handicap (${playerRankObject.tournamentHandicap}) - Rank (${
        playerRankObject.rank
      })`
      let score = (
        rankToScoreMap[playerRankObject.rank] +
        playerRankObject.tournamentHandicap -
        playerRankObject.rank
      ).toFixed(1)
      if (teamGame) {
        tooltip = `Base Score for Rank (${
          rankToScoreMap[playerRankObject.rank]
        })`
        score = `${rankToScoreMap[playerRankObject.rank]}`
      }
      if (modifiedScoring) {
        tooltip = `( ${tooltip} ) * Modified Scoring (2)`
        score = (Number(score) * 2).toFixed(1)
      }
      const borderHighlight: CSSProperties = {
        borderBottomColor: playerColor,
        borderBottomStyle: 'solid',
        borderBottomWidth: '2px',
      }
      const totalHighlight: CSSProperties = {
        backgroundColor: playerColor,
        borderRadius: '0.25rem',
      }
      const isSchedulePlayerColor = playerColor ? totalHighlight : {}
      const normalPlayerColor = playerColor ? borderHighlight : {}
      const useUsernamesName = useUsernames
        ? playerRankObject.player.username
        : `${playerRankObject.player.firstName} ${playerRankObject.player.lastName}`
      return (
        <Row
          className="mb-1 link-color-fix justify-content-between"
          style={isSchedule ? isSchedulePlayerColor : normalPlayerColor}
        >
          {isSchedule ? (
            <div>{usePlayer ? playerRankObject.player : useUsernamesName}</div>
          ) : (
            <div>
              <Col md="auto">
                <span
                  key={`${roundObject.pk}-${playerRankObject.player.username}`}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    <HoverTooltip
                      tooltip={playerRankObject.score}
                      text={playerRankObject.rank}
                    />
                  </span>
                  {': '}
                  <Link to={`/player/${playerRankObject.player.pk}`}>
                    {usePlayer ? playerRankObject.player : useUsernamesName}
                  </Link>
                </span>
              </Col>
              <Col md="auto">
                <span
                  key={`${roundObject.pk}-${playerRankObject.player.username}`}
                >
                  <span>
                    {showTournamentScores ? (
                      <HoverTooltip tooltip={tooltip} text={score} />
                    ) : (
                      playerRankObject.score
                    )}
                  </span>
                </span>
              </Col>
            </div>
          )}
        </Row>
      )
    })

  const roundMoment = moment(roundObject.date)
  const dateFromNow = roundMoment.fromNow()
  const datePretty = roundMoment.format('LL')
  const dateWithTooltip = (
    <HoverTooltip tooltip={datePretty} text={dateFromNow} />
  )

  const roundScoresLimited = roundScores
  // roundScores.length > 4
  //   ? [...roundScores.slice(0, 3), `and ${roundScores.length - 3} more...`]
  //   : roundScores

  return (
    <CardDisplay
      title={roundObject.game.name}
      subtitle={dateWithTooltip}
      content={roundScoresLimited}
    >
      {children}
    </CardDisplay>
  )
}
