import React from 'react'
import { List, Text } from '@mantine/core'
import { UseListStateHandlers } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export const DraggableList: React.FC<{
  children?: any
  state: any[]
  handlers: UseListStateHandlers<any>
}> = ({ children, state, handlers }) => {
  const draggableItems = state.slice(0, 10).map((item, index) => (
    <Draggable key={item.key} index={index} draggableId={item.key.toString()}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <List.Item
            style={{
              borderStyle: 'solid',
              borderColor: 'lightgrey',
              borderWidth: '1px',
              borderRadius: '3px',
              margin: '3px',
              padding: '3px',
              backgroundColor: 'white',
            }}
          >
            <Text>{item.value}</Text>
          </List.Item>
        </div>
      )}
    </Draggable>
  ))

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
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
