import React from 'react'
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
  playerColorMapping?: Map<number, string>
  showTournamentScores?: boolean
}> = ({ children, roundObject, playerColorMapping, showTournamentScores }) => {
  // Get the players and their scores/ranks listed out
  const roundScores = roundObject.playerRanks
    ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
    .map((playerRankObject: PlayerRankObject) => {
      const playerColor = playerColorMapping?.get(playerRankObject.player.pk)
      return (
        <Row
          className="mb-1 link-color-fix justify-content-between"
          style={
            playerColor
              ? {
                  borderBottomColor: playerColor,
                  borderBottomStyle: 'solid',
                  borderBottomWidth: '2px',
                }
              : {}
          }
        >
          <Col md="auto">
            <span key={`${roundObject.pk}-${playerRankObject.player.username}`}>
              <span style={{ fontWeight: 'bold' }}>
                <HoverTooltip
                  tooltip={playerRankObject.score}
                  text={playerRankObject.rank}
                />
              </span>
              {': '}
              <Link to={`/player/${playerRankObject.player.pk}`}>
                {playerRankObject.player.username}
              </Link>
            </span>
          </Col>
          <Col md="auto">
            <span key={`${roundObject.pk}-${playerRankObject.player.username}`}>
              <span>
                {showTournamentScores ? (
                  <HoverTooltip
                    tooltip={`Base Score for Rank (${
                      rankToScoreMap[playerRankObject.rank]
                    }) + Player's Handicap (${
                      playerRankObject.tournamentHandicap
                    }) - Rank (${playerRankObject.rank})`}
                    text={(
                      rankToScoreMap[playerRankObject.rank] +
                      playerRankObject.tournamentHandicap -
                      playerRankObject.rank
                    ).toFixed(1)}
                  />
                ) : (
                  playerRankObject.score
                )}
              </span>
            </span>
          </Col>
        </Row>
      )
    })

  const roundMoment = moment(roundObject.date)
  const dateFromNow = roundMoment.fromNow()
  const datePretty = roundMoment.format('LL')
  const dateWithTooltip = (
    <HoverTooltip tooltip={datePretty} text={dateFromNow} />
  )

  const roundScoresLimited =
    roundScores.length > 4
      ? [...roundScores.slice(0, 3), `and ${roundScores.length - 3} more...`]
      : // roundScores
        roundScores

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
