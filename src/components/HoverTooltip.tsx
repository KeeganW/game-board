import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export const HoverTooltip: React.FC<{
  tooltip: string | number
  text: any
}> = ({ tooltip, text }) => {
  return (
    <OverlayTrigger
      delay={{ hide: 200, show: 300 }}
      // eslint-disable-next-line react/no-unstable-nested-components
      overlay={props => <Tooltip {...props}>{tooltip}</Tooltip>}
      placement="top"
    >
      <span>{text}</span>
    </OverlayTrigger>
  )
}
