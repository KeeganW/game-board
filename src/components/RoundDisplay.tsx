import React, { useContext } from 'react'
import moment from 'moment'
import { PlayerRankObject, RoundObject } from 'src/types'
import { HoverTooltip } from 'src/components/HoverTooltip'
import { CardDisplay } from 'src/components/CardDisplay'
import { PlayerRankDisplay } from 'src/components/PlayerRankDisplay'
import { RowDisplay } from 'src/components/RowDisplay'
import { AuthContext } from '../Context'

export const RoundDisplay: React.FC<{
  children?: any
  roundObject: RoundObject
  teamColorMapping?: Map<number | string, string>
  showTournamentScores?: boolean
  modifiedScoring?: boolean
  teamGame?: boolean
  useUsernames?: boolean
  usePlayer?: boolean
  isSchedule?: boolean
  highlightPlayerPk?: number
}> = ({
  children,
  roundObject,
  teamColorMapping,
  showTournamentScores,
  modifiedScoring,
  teamGame,
  useUsernames,
  usePlayer,
  isSchedule,
  highlightPlayerPk,
}) => {
  const { playerPk } = useContext(AuthContext)
  // Get the players and their scores/ranks listed out
  const roundScores = roundObject.playerRanks
    ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
    .map((playerRankObject: PlayerRankObject) => {
      return (
        <PlayerRankDisplay
          playerRankObject={playerRankObject}
          teamColorMapping={teamColorMapping}
          showTournamentScores={showTournamentScores}
          modifiedScoring={modifiedScoring}
          teamGame={teamGame}
          useUsernames={useUsernames}
          usePlayer={usePlayer}
          isSchedule={isSchedule}
          activePlayerPk={playerPk}
          highlightPlayerPk={highlightPlayerPk}
        />
      )
    })

  const playerRanksHeader = (
    <RowDisplay
      rank={<HoverTooltip tooltip="Rank" text="R" />}
      player="Player"
      score={<HoverTooltip tooltip="Score" text="S" />}
    />
  )

  const roundMoment = moment(roundObject.date).set('hours', 19)
  const dateFromNow = roundMoment.fromNow()
  const datePretty = roundMoment.format('LL')
  const dateWithTooltip = (
    <HoverTooltip tooltip={datePretty} text={dateFromNow} />
  )

  const roundScoresWithHeader = [playerRanksHeader, ...roundScores]
  // roundScores.length > 4
  //   ? [...roundScores.slice(0, 3), `and ${roundScores.length - 3} more...`]
  //   : roundScores

  return (
    <CardDisplay
      title={roundObject.game.name}
      subtitle={dateWithTooltip}
      content={isSchedule ? roundScores : roundScoresWithHeader}
    >
      {children}
    </CardDisplay>
  )
}
