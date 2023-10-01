import { useParams } from 'react-router-dom'
import {
  FetchResponse,
  TournamentObject,
  TournamentTeamColors,
} from 'src/types'

export const rankToScoreMap: { [key: number]: number } = {
  1: 9,
  2: 7,
  3: 5,
  4: 3,
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

// TODO(keegan): implement this function for white vs black text:
//  https://blog.cristiana.tech/calculating-color-contrast-in-typescript-using-web-content-accessibility-guidelines-wcag
export type RGBValue = {
  r: number
  g: number
  b: number
}
export const hexToRGB = (hexCode: string): RGBValue => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      }
}

export const rgbToStyle = (rgbValue: RGBValue): string =>
  `rgb(${rgbValue.r},${rgbValue.g},${rgbValue.b},0.5)`

export type StringToStringMap = Map<string, string>
export type NumberToStringMap = Map<number, string>

export const getTeamColors = (
  tournamentInfo: TournamentObject
): StringToStringMap => {
  const teamColorMap = new Map<string, string>()
  tournamentInfo.bracket.teams.forEach(team => {
    const teamColorRGB = hexToRGB(team.color)
    teamColorMap.set(team.name, rgbToStyle(teamColorRGB))
  })
  return teamColorMap
}

export const getTeamColorsMap = (
  teamColors: TournamentTeamColors
): StringToStringMap => {
  const teamColorMap = new Map<string, string>()
  Object.entries(teamColors).forEach(value => {
    const teamColorRGB = hexToRGB(value[1])
    teamColorMap.set(value[0], rgbToStyle(teamColorRGB))
  })
  return teamColorMap
}

export const isStillLoading = (fetchResponses: FetchResponse[]): boolean => {
  let isLoading = false
  fetchResponses.forEach((fetchResponse: FetchResponse) => {
    isLoading =
      !fetchResponse.response ||
      !fetchResponse.response.data ||
      fetchResponse.loading
        ? true
        : isLoading
  })
  return isLoading
}
