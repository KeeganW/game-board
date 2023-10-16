import React from 'react'
import { Tooltip } from '@mantine/core'

export const HoverTooltip: React.FC<{
  tooltip: string | number
  text: any
}> = ({ tooltip, text }) => {
  return (
    <Tooltip label={tooltip}>
      <span>{text}</span>
    </Tooltip>
  )
}
