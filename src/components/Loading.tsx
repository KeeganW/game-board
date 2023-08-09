import React from 'react'
import { Spinner } from 'react-bootstrap'
import { CenteredPage } from './CenteredPage'

/**
 * A bootstrap formatted loading spinner, which can be popped in wherever needed.
 */
export const Loading: React.FC = () => (
  <CenteredPage>
    <Spinner animation="border" variant="primary" />
  </CenteredPage>
)
