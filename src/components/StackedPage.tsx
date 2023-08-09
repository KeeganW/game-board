import React from 'react'
import { Stack } from 'react-bootstrap'
import { GapValue } from 'react-bootstrap/types'

export const StackedPage: React.FC<{
  gap?: GapValue
  pageWidth?: number
  children?: any
}> = ({ gap, pageWidth, children }) => (
  <main
    className="p-3 mx-auto text-center"
    style={pageWidth ? { width: `${pageWidth}px` } : {}}
  >
    <Stack gap={gap || 0} className="mx-auto">
      {children}
    </Stack>
  </main>
)
