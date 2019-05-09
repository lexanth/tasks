import React, { Component } from 'react'
import styled from 'styled-components/macro'
import Column from './Column'
import {
  DragDropContext,
  Droppable,
  DropResult,
  DroppableProvided,
  DraggableLocation,
} from 'react-beautiful-dnd'
import { CardColumn, ColumnMove, CardMove } from './types'
import { connect } from 'react-redux'
import { State, addList, reorderList, moveCard } from './createStore'

const DivWithoutHeight: React.FC<{ height: string }> = ({
  height,
  ...props
}) => <div {...props} />

const ParentContainer = styled(DivWithoutHeight)`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`

const Container = styled.div`
  background-color: #5c616c;
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`
const AddColumnTitle = styled.h4`
  padding: 8px;
`

const AddColumnButton = styled.div`
  margin: 8px;
  width: 250px;
  background-color: rgba(0, 0, 0, 0.12);
  color: white;
  align-self: flex-start;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`
type Props = {
  columns: CardColumn[]
  containerHeight: string
  addList: () => void
  reorderList: (moveDetails: ColumnMove) => void
  moveCard: (moveDetails: CardMove) => void
}

class Board extends Component<Props, {}> {
  // boardRef: ?HTMLElement;

  onDragEnd = (result: DropResult) => {
    // dropped nowhere
    if (!result.destination) {
      return
    }
    const source: DraggableLocation = result.source
    const destination: DraggableLocation = result.destination
    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }
    // reordering column
    if (result.type === 'COLUMN') {
      this.props.reorderList({
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
      return
    }
    this.props.moveCard({
      cardId: result.draggableId,
      sourceListId: source.droppableId,
      sourceIndex: source.index,
      destinationListId: destination.droppableId,
      destinationIndex: destination.index,
    })
  }

  render() {
    const { columns, containerHeight, addList } = this.props

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={false}
      >
        {(provided: DroppableProvided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {columns.map((column: CardColumn, index: number) => (
              <Column
                key={column.id}
                index={index}
                columnId={column.id}
                title={column.title}
                cardIds={column.cardIds}
                isScrollable={false}
                isCombineEnabled={false}
              />
            ))}
            {provided.placeholder}
            <AddColumnButton onClick={addList}>
              <AddColumnTitle>+ Add list</AddColumnTitle>
            </AddColumnButton>
          </Container>
        )}
      </Droppable>
    )

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
          board
        )}
      </DragDropContext>
    )
  }
}

export default connect(
  (state: State) => ({ columns: state.columns }),
  { addList, reorderList, moveCard }
)(Board)