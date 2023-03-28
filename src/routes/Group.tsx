import React, { useContext, useEffect, useState } from 'react'
import { Stack } from 'react-bootstrap'
import axios from 'src/axiosAuth'
import { useParams } from 'react-router-dom'
import { AuthContext } from 'src/Context'
import { useUpdatePlayerInfo } from 'src/utils/hooks'

export const Group: React.FC = () => {
  useUpdatePlayerInfo()
  const { playerPk } = useContext(AuthContext)
  const [extraInfo, setExtraInfo] = useState(undefined)

  // Get player info if provided
  const params = useParams()
  const { pk } = params
  const groupPk = pk || ''
  useEffect(() => {
    // TODO on 401, redirect
    axios.get(`http://localhost:8000/group/${groupPk}`).then((res) => {
      setExtraInfo(res.data)
      console.log(res.data)
    })
  }, [groupPk])

  return (
    <Stack className="mx-auto">
      <main className="p-3 mx-auto text-center">
        {playerPk && groupPk && extraInfo ? `Group name: ${extraInfo['name']}` : 'Group info is limited to logged in users.'}
      </main>
    </Stack>
  )
}
