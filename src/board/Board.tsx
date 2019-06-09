import React, { Component } from 'react'
import styled from 'styled-components/macro'
import Column from '../column/Column'
import {
  DragDropContext,
  Droppable,
  DropResult,
  DroppableProvided,
  DraggableLocation,
} from 'react-beautiful-dnd'
import { CardColumn, ColumnMove, CardMove } from '../types'
import { connect } from 'react-redux'
import { State, addList, reorderList, moveCard } from '../createStore'
import { opacify } from 'polished'

const DivWithoutHeight: React.FC<{ height: string }> = ({
  height,
  ...props
}) => <div {...props} />

const ParentContainer = styled(DivWithoutHeight)`
  height: ${({ height }) => height};
  /* overflow-x: hidden; */
  overflow-y: auto;
`

const Container = styled.div`
  background-color: ${props => props.theme.board};
  min-height: 100%;
  max-height: 100%;
  /* like display:flex but will allow bleeding over the window width */
  /* min-width: 100vw; */
  width: 100%;
  overflow-x: auto;
  display: inline-flex;
`
const AddColumnTitle = styled.p`
  padding: 8px;
  font-size: 16px;
  margin: 0;
`

const AddColumnButton = styled.div`
  margin: 8px;
  width: 250px;
  flex-shrink: 0;
  background-color: ${props => props.theme.overlay.dark};
  color: ${props => props.theme.text};
  align-self: flex-start;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  &:hover {
    background-color: ${props => opacify(0.2, props.theme.overlay.dark)};
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
