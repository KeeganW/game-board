import { PlayerInfo } from '../types'

type Tokens = {
  access: string | undefined
  refresh: string | undefined
}

const ACCESS_TOKEN_LOCAL_NAME: string = 'tokenAccess'
const REFRESH_TOKEN_LOCAL_NAME: string = 'tokenRefresh'
const USER_STATE_LOCAL_NAME: string = 'initialState'

export const getTokens = (): Tokens => ({
  access: localStorage.getItem(ACCESS_TOKEN_LOCAL_NAME) || undefined,
  refresh: localStorage.getItem(REFRESH_TOKEN_LOCAL_NAME) || undefined,
})

export const setTokens = (newTokens: Tokens) => {
  if (newTokens.access) {
    localStorage.setItem(ACCESS_TOKEN_LOCAL_NAME, newTokens.access)
  }
  if (newTokens.refresh) {
    localStorage.setItem(REFRESH_TOKEN_LOCAL_NAME, newTokens.refresh)
  }
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_NAME)
  localStorage.removeItem(REFRESH_TOKEN_LOCAL_NAME)
  localStorage.removeItem(USER_STATE_LOCAL_NAME)
}

export const getUserState = (): PlayerInfo => {
  const localStorageParsed = JSON.parse(
    localStorage.getItem('initialState') || '{}'
  )
  if (
    localStorageParsed.playerPk &&
    localStorageParsed.groupPk &&
    localStorageParsed.groupName &&
    localStorageParsed.groupImageUrl
  ) {
    return localStorageParsed
  }
  // Did not find anything from the local storage, so just return nothing
  return {
    playerPk: -1,
    groupPk: -1,
    groupName: '',
    groupImageUrl: '',
    detail: '',
  }
}

export const setUserState = (newState: PlayerInfo) => {
  localStorage.setItem(USER_STATE_LOCAL_NAME, JSON.stringify(newState))
}
