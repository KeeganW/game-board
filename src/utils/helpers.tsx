import React from 'react'
import {
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
  Stack,
} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { GapValue } from 'react-bootstrap/types'
import { PlayerRankObject, RoundObject } from '../types'

/**
 * A centered page, to make all our pages look the same.
 *
 * @param gap The gap size we want with this page
 * @param pageWidth If we want to limit the width of the page, pass in the width here
 * @param children The rest of the page we want to display.
 */
export const CenteredPage: React.FC<{
  gap?: GapValue
  pageWidth?: number
  children?: any
}> = ({ gap, pageWidth, children }) => (
  <Stack gap={gap || 0} className="mx-auto">
    <main
      className="p-3 mx-auto text-center"
      style={pageWidth ? { width: `${pageWidth}px` } : {}}
    >
      {children}
    </main>
  </Stack>
)
export const StackedPage: React.FC<{
  gap?: GapValue
  pageWidth?: number
  children?: any
}> = ({ gap, pageWidth, children }) => (
  <main
    className="p-3 mx-auto text-center"
    style={pageWidth ? { width: `${pageWidth}px` } : {}}
  >
    <Stack gap={gap || 0} className="mx-auto">
      {children}
    </Stack>
  </main>
)

/**
 * A bootstrap formatted loading spinner, which can be popped in wherever needed.
 */
export const Loading: React.FC = () => (
  <CenteredPage>
    <Spinner animation="border" variant="primary" />
  </CenteredPage>
)

/**
 * Generates a bootstrap formatted list.
 *
 * @param children Any children to insert after the list
 * @param listObject The list to format
 * @param prefix Any prefix to apply to the link for the list
 * @param alternateDisplay Any display override for the list that you want to do
 */
export const BasicList: React.FC<{
  children?: any
  listObject: any[] | undefined
  prefix?: string
  // eslint-disable-next-line no-unused-vars
  alternateDisplay?: (value: any) => any
}> = ({ children, listObject, prefix, alternateDisplay }) => {
  const links = listObject?.map(value => (
    <ListGroupItem as={Link} to={`${prefix || ''}${value.pk}`} key={value.pk}>
      {alternateDisplay ? alternateDisplay(value) : value.name}
    </ListGroupItem>
  ))
  return (
    <>
      <ListGroup variant="flush" className="align-items-center">
        {links}
      </ListGroup>
      {children}
    </>
  )
}

export const RoundDisplay: React.FC<{
  children?: any
  roundObject: RoundObject
  playerColorMapping?: Map<number, string>
}> = ({ children, roundObject, playerColorMapping }) => {
  // Get the players and their scores/ranks listed out
  const roundScores = roundObject.playerRanks
    ?.sort((a: PlayerRankObject, b: PlayerRankObject) => a.rank - b.rank)
    .map((playerRankObject: PlayerRankObject) => {
      const playerColor = playerColorMapping?.get(playerRankObject.player.pk)
      return (
        <Row className="mb-1 justify-content-md-center">
          <Col
            xs
            md="auto"
            className="rounded"
            style={playerColor ? { backgroundColor: playerColor } : {}}
          >
            <span key={`${roundObject.pk}-${playerRankObject.player.username}`}>
              <span style={{ fontWeight: 'bold' }}>
                {playerRankObject.rank}
              </span>
              {': '}
              <Link to={`/player/${playerRankObject.player.pk}`}>
                {playerRankObject.player.username}
              </Link>
              {' ('}
              {`${playerRankObject.score}`}
              {') '}
            </span>
          </Col>
        </Row>
      )
    })

  return (
    <Col key={`round-${roundObject.pk}`} style={{ minWidth: 175 }}>
      <div
        className="mb-2 d-flex align-items-center justify-content-center"
        style={{ minHeight: 50 }}
      >
        <div>
          <h5 className="mb-0" key={`round-game-${roundObject.pk}`}>
            {roundObject.game.name}
          </h5>
        </div>
      </div>
      {roundScores}
      {children}
    </Col>
  )
}

/**
 * Capitalizes any given string.
 *
 * @param word The string to capitalize
 * @returns a capitalized string.
 */
export function capitalizeString(word: string) {
  if (!word) return word
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Gets the param `pk` from the params of the page.
 *
 * @returns Returns the pk, or an empty string
 */
export function useParamsPk() {
  const params = useParams()
  const { pk } = params
  return pk || ''
}

/**
 * Computes the suffix of a number, using the following rules:
 * st is used with numbers ending in 1 (e.g. 1st, pronounced first)
 * nd is used with numbers ending in 2 (e.g. 92nd, pronounced ninety-second)
 * rd is used with numbers ending in 3 (e.g. 33rd, pronounced thirty-third)
 * As an exception to the above rules, all the "teen" numbers ending with 11, 12 or 13 use -th
 *  (e.g. 11th, pronounced eleventh, 112th, pronounced one hundred [and] twelfth)
 * th is used for all other numbers (e.g. 9th, pronounced ninth).
 *
 * @param input The number we want to add the suffix to.
 * @returns The number with its suffix, as a string
 */
export function ordinalSuffix(input: number) {
  const ones = input % 10
  const tens = input % 100
  if (ones === 1 && tens !== 11) {
    return `${input}st`
  }
  if (ones === 2 && tens !== 12) {
    return `${input}nd`
  }
  if (ones === 3 && tens !== 13) {
    return `${input}rd`
  }
  return `${input}th`
}
