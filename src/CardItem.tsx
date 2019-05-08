import React from 'react'
import styled from 'styled-components/macro'
import { DraggableProvided } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { State } from './createStore'
import EditingContext from './EditingContext'

const grid: number = 8
const borderRadius: number = 2
type OwnProps = {
  cardId: string
  isDragging: boolean
  provided: DraggableProvided
  isGroupedOver?: boolean
}
type StateProps = {
  title: string
}
type Props = OwnProps & StateProps

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean | undefined
) => {
  if (isDragging) {
    return 'rgb(89, 88, 88)'
  }

  if (isGroupedOver) {
    return 'red'
  }

  return 'rgb(44, 43, 43)'
}

const getBorderColor = (isDragging: boolean) =>
  isDragging ? 'rgb(126, 126, 126)' : 'transparent'

const PropStrippedAnchor: React.FC<
  {
    isDragging: boolean
    isGroupedOver: boolean | undefined
    innerRef: any
  } & React.DOMAttributes<HTMLDivElement>
> = ({ isDragging, isGroupedOver, innerRef, ...props }) => (
  <div ref={innerRef} {...props} />
)

const Container = styled(PropStrippedAnchor)`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging)};
  background-color: ${props =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px #A5ADBA` : 'none'};
  padding: ${grid}px;
  min-height: 25px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: white;

  &:hover,
  &:active {
    color: '';
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: #ffc400;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`

const Content = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;

  /* flex parent */
  display: flex;
  flex-direction: column;
`

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function CardItem(props: Props) {
  const { isDragging, isGroupedOver, provided, title, cardId } = props

  return (
    <EditingContext.Consumer>
      {handleClick => (
        <Container
          isDragging={isDragging}
          isGroupedOver={isGroupedOver}
          innerRef={provided.innerRef}
          onClick={() => {
            if (handleClick) {
              handleClick(cardId)
            }
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Content>{title}</Content>
        </Container>
      )}
    </EditingContext.Consumer>
  )
}

export default connect((state: State, ownProps: OwnProps) => ({
  title: state.cards[ownProps.cardId].title,
}))(React.memo<Props>(CardItem))
