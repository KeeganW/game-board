import { Container, Flex } from '@mantine/core'
import React from 'react'

/**
 * A centered page, to make all our pages look the same.
 *
 * @param pageWidth If we want to limit the width of the page, pass in the width here
 * @param children The rest of the page we want to display.
 */
export const CenteredPage: React.FC<{
  pageWidth?: number
  children?: any
}> = ({ pageWidth, children }) => {
  if (pageWidth) {
    return (
      <Container style={{ width: `${pageWidth}px` }}>
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          {children}
        </Flex>
      </Container>
    )
  }
  return (
    <Container fluid style={{}}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        {children}
      </Flex>
    </Container>
  )
}
