import React from 'react'
import { ActionIcon, Flex, Group, List, Text } from '@mantine/core'
import { UseListStateHandlers } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { IconMenu2, IconQuestionMark } from '@tabler/icons-react'

export const DraggableList: React.FC<{
  children?: any
  state: any[]
  handlers: UseListStateHandlers<any>
  startIndex: number
  endIndex: number
}> = ({ children, state, handlers, startIndex, endIndex }) => {
  const draggableItems = state
    .slice(startIndex, endIndex)
    .map((item, index) => (
      <Draggable key={item.key} index={index} draggableId={item.key.toString()}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Group
              justify="space-between"
              style={{
                borderStyle: 'solid',
                borderColor: 'lightgrey',
                borderWidth: '1px',
                borderRadius: '3px',
                margin: '3px',
                padding: '3px',
                backgroundColor: 'white',
                height: '40px',
              }}
            >
              <List.Item>
                <Text>{item.value}</Text>
              </List.Item>

              <Flex gap="5px">
                <ActionIcon
                  component="a"
                  href={`https://boardgamegeek.com/boardgame/${item?.round?.game?.bggId}`}
                  size="sm"
                  aria-label="Open in a new tab"
                  target="_blank"
                  color="gray"
                  // onClick={(event: any) => event.preventDefault()}
                >
                  <IconQuestionMark />
                </ActionIcon>

                <IconMenu2
                  style={
                    {
                      // color: 'lightgrey',
                      // marginRight: "10px"
                    }
                  }
                />
              </Flex>
            </Group>
          </div>
        )}
      </Draggable>
    ))

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({
          from: source.index + startIndex,
          to: (destination?.index || 0) + startIndex,
        })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <List type="ordered">{draggableItems}</List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {children}
    </DragDropContext>
  )
}
