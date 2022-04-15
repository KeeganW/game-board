import React from 'react'
import { useParams } from 'react-router-dom'
import { Stack } from 'react-bootstrap'

export function Sharks() {
  const params = useParams()
  const { sharkName } = params

  return (
    <Stack className="mx-auto">
      <main className="col-md-6 p-3 mx-auto text-center">
        <h2>Sharks</h2>
        { sharkName ? (
          <div>
            {sharkName}
            s are cool!
          </div>
        ) : (
          <div>
            Sharks are cool!
          </div>
        ) }
      </main>
    </Stack>
  )
}
