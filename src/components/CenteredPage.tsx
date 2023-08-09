import React from 'react'
import { Stack } from 'react-bootstrap'
import { GapValue } from 'react-bootstrap/types'

/**
 * A centered page, to make all our pages look the same.
 *
 * @param gap The gap size we want with this page
 * @param pageWidth If we want to limit the width of the page, pass in the width here
 * @param children The rest of the page we want to display.
 */
export const CenteredPage: React.FC<{
  gap?: GapValue
  pageWidth?: number
  children?: any
}> = ({ gap, pageWidth, children }) => (
  <Stack gap={gap || 0} className="mx-auto">
    <main
      className="p-3 mx-auto text-center"
      style={pageWidth ? { width: `${pageWidth}px` } : {}}
    >
      {children}
    </main>
  </Stack>
)
