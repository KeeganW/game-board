import { createContext } from 'react'

export const AuthContext = createContext({
  /* eslint-disable */
  authenticated: false,
  setAuthenticated: (auth: boolean) => {},
  tokenAccess: '',
  setTokenAccess: (tokenAccess: string) => {},
  tokenRefresh: '',
  setTokenRefresh: (tokenRefresh: string) => {},
  playerPk: -1,
  setPlayerPk: (playerPk: number) => {},
  groupPk: -1,
  setGroupPk: (groupPk: number) => {},
  groupName: '',
  setGroupName: (groupName: string) => {},
  groupImageUrl: '',
  setGroupImageUrl: (groupImageUrl: string) => {},
  /* eslint-enable */
})
