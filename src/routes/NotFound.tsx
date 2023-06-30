import React from 'react'
import { CenteredPage } from 'src/utils/helpers'
import { Link } from 'react-router-dom'

export const NotFound = () => (
  <CenteredPage>
    Nothing found here. Sorry! Please go back, or
    {' '}
    <Link to="/">go home</Link>
    .
  </CenteredPage>
)
