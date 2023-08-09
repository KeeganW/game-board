import React from 'react'
import { Link } from 'react-router-dom'
import { CenteredPage } from 'src/components/CenteredPage'

export const NotFound = () => (
  <CenteredPage>
    Nothing found here. Sorry! Please go back, or <Link to="/">go home</Link>.
  </CenteredPage>
)
