import React from 'react'
import { Card, Flex, Title } from '@mantine/core'

export const CardDisplay: React.FC<{
  children?: any
  title: any
  subtitle: any
  content: any
}> = ({ children, title, subtitle, content }) => {
  return (
    <Card withBorder shadow="sm" radius="md" pb="xl" style={{ width: '320px' }}>
      <Title order={3}>{title}</Title>
      <Title order={6}>{subtitle}</Title>

      <Card.Section>
        <Flex
          direction={{ base: 'column', sm: 'column' }}
          // gap={{ base: 'sm', sm: 'lg' }}
          justify={{ base: 'center', sm: 'center' }}
        >
          {content}
        </Flex>
      </Card.Section>

      {children}
    </Card>
  )
}
