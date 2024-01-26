import { useContext } from 'react'
import { AuthContext } from 'src/Context'
import {
  BracketMatchesObject,
  FetchResponse,
  GameObject,
  GroupObjectLite,
  PlayerInfo,
  PlayerObjectFull,
  PlayerRankObject,
  PlayerStats,
  RecentRounds,
  RoundObject,
  RoundObjectLite,
  TournamentMatch,
  TournamentMatches,
  TournamentNames,
  TournamentObject,
  TournamentPlayers,
  TournamentSchedule,
  TournamentScores,
  TournamentStats,
  TournamentTeamColors,
  TournamentTeamPlayers,
} from 'src/types'
import useAxios from 'src/useAxios'
import { setUserState } from './localStorageService'

/**
 * A generic get hook which calls useAxios, and then formats the response to be a specific type.
 *
 * @param url The url to call with the get hook.
 * @param params Any params to pass along
 */
function useGetResponse<Type>(url: string, params?: any): FetchResponse {
  const hookResponse = useAxios({
    method: 'GET',
    url,
    params,
  })
  // Specifically set the data type to be Type
  return {
    ...hookResponse,
    response: hookResponse.response
      ? {
          ...hookResponse.response,
          data: hookResponse.response.data
            ? (hookResponse.response.data as Type)
            : hookResponse.response.data,
        }
      : hookResponse.response,
  }
}

export function useUpdatePlayerInfo() {
  const {
    authenticated,
    setAuthenticated,
    setPlayerPk,
    setGroupPk,
    setGroupName,
    setGroupImageUrl,
  } = useContext(AuthContext)
  const playerInfoResponse = useGetResponse<PlayerInfo>('/player_info/')

  if (
    !playerInfoResponse.loading &&
    playerInfoResponse.response &&
    playerInfoResponse.response.status === 200 &&
    !authenticated
  ) {
    const playerInfoResObj = playerInfoResponse.response.data
    setUserState(playerInfoResObj)
    setAuthenticated(true)
    setPlayerPk(playerInfoResObj.playerPk)
    setGroupPk(playerInfoResObj.groupPk)
    setGroupName(playerInfoResObj.groupName)
    setGroupImageUrl(playerInfoResObj.groupImageUrl)
  }
}

export function useLogout() {
  const url = '/logout/'
  return useGetResponse<any>(url)
}

export function useGetGroup(
  groupPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/group/${groupPk || ''}`
  return useGetResponse<GroupObjectLite>(url, params)
}

export function useGetPlayer(
  playerPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/player/${playerPk || ''}`
  return useGetResponse<PlayerObjectFull>(url, params)
}

export function useGetGame(
  gamePk?: string | number,
  params?: any
): FetchResponse {
  const url = `/game/${gamePk || ''}`
  return useGetResponse<GameObject>(url, params)
}

export function useGetPlayerRank(
  playerRankPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/player_rank/${playerRankPk || ''}`
  return useGetResponse<PlayerRankObject>(url, params)
}

export function useGetRound(
  roundPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/round/${roundPk || ''}`
  return useGetResponse<RoundObjectLite>(url, params)
}

export function useGetGameRound(
  roundPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/game_round/${roundPk || ''}`
  return useGetResponse<RoundObject>(url, params)
}

export function useGetMatch(
  matchPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/bracket_match/${matchPk || ''}`
  return useGetResponse<BracketMatchesObject>(url, params)
}

export function useGetTournamentMatches(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_matches/${tournamentPk || ''}`
  return useGetResponse<TournamentMatches>(url, params)
}

export function useGetTournament(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament/${tournamentPk || ''}`
  return useGetResponse<TournamentObject>(url, params)
}

export function useGetPlayerStats(
  playerPk: string | number,
  params?: any
): FetchResponse {
  const url = `/player_stats/${playerPk}`
  return useGetResponse<PlayerStats>(url, params)
}

export function useGetTournamentStats(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_stats/${tournamentPk || ''}`
  return useGetResponse<TournamentStats>(url, params)
}

export function useGetTournamentTeamColors(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_team_colors/${tournamentPk || ''}`
  return useGetResponse<TournamentTeamColors>(url, params)
}

export function useGetTournamentNames(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_names/${tournamentPk || ''}`
  return useGetResponse<TournamentNames>(url, params)
}

export function useGetTournamentScores(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_scores/${tournamentPk || ''}`
  return useGetResponse<TournamentScores>(url, params)
}

export function useGetTournamentSchedule(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_schedule/${tournamentPk || ''}`
  return useGetResponse<TournamentSchedule>(url, params)
}

export function useGetTournamentPlayers(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_players/${tournamentPk || ''}`
  return useGetResponse<TournamentPlayers>(url, params)
}

export function useGetTournamentTeamPlayers(
  tournamentPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_team_players/${tournamentPk || ''}`
  return useGetResponse<TournamentTeamPlayers>(url, params)
}

export function useGetTournamentMatch(
  tournamentPk: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_match/${tournamentPk}`
  return useGetResponse<TournamentMatch>(url, params)
}

export function useGetAdminTournamentMatch(
  tournamentPk: string | number,
  params?: any
): FetchResponse {
  const url = `/admin_tournament_match/${tournamentPk}`
  return useGetResponse<TournamentMatch>(url, params)
}

export function useGetTournamentInfo(
  tournamentPk: string | number,
  params?: any
): FetchResponse {
  const url = `/tournament_info/${tournamentPk}`
  return useGetResponse<TournamentObject>(url, params)
}

export function useGetRecentRounds(
  groupPk?: string | number,
  params?: any
): FetchResponse {
  const url = `/recent_rounds/${groupPk || ''}`
  return useGetResponse<RecentRounds>(url, params)
}
