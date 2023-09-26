import React from 'react'
import { Navigate } from 'react-router-dom'
import { useGetGameRound, useUpdatePlayerInfo } from 'src/utils/hooks'
import { useParamsPk } from 'src/utils/helpers'
import { CenteredPage } from 'src/components/CenteredPage'
import { Loading } from 'src/components/Loading'
import { RoundDisplay } from 'src/components/RoundDisplay'

export const Round: React.FC = () => {
  useUpdatePlayerInfo()
  const paramsPk = useParamsPk()
  const roundResponse = useGetGameRound(paramsPk)

  // Only show the page if things are still loading
  if (
    !roundResponse.response ||
    !roundResponse.response.data ||
    roundResponse.loading
  ) {
    return (
      <CenteredPage>
        <Loading />
      </CenteredPage>
    )
  }
  // Catch weird instances where we need to log out
  if (roundResponse.response.status === 401) {
    return <Navigate replace to="/logout/" />
  }

  const roundObject = roundResponse.response.data.round

  return (
    <CenteredPage>
      <RoundDisplay roundObject={roundObject} />
    </CenteredPage>
  )
}
