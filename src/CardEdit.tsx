import React from 'react'
import styled from 'styled-components/macro'
import { connect } from 'react-redux'
import { State, updateCard } from './createStore'
import InlineTextEdit from './InlineTextEdit'
import { Card, CardColumn, ColumnMove, CardMove, CardUpdate } from './types'
import InlineMarkdownEdit from './InlineMarkdownEdit'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.primary.medium};
  min-height: 100%;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: ${props => props.theme.primary.dark};
  min-height: 32px;
`

const Button = styled.button`
  border: none;
  color: ${props => props.theme.text};
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${props => props.theme.primary.dark};
  &:hover {
    background-color: ${props => props.theme.primary.light};
  }
`

type OwnProps = {
  setEditing: (cardId: string | null) => void
  editingCardId: string
}
type StateProps = {
  title: string
  description: string
  updateCard: (update: CardUpdate) => void
}
type Props = OwnProps & StateProps

const CardEdit: React.FC<Props> = ({
  setEditing,
  title,
  updateCard,
  editingCardId,
  description,
}) => (
  <Container>
    <Header>
      <InlineTextEdit
        value={title}
        onChange={newValue =>
          updateCard({
            cardId: editingCardId,
            field: 'title',
            newValue: newValue,
          })
        }
      />
      <Button onClick={() => setEditing(null)}>X</Button>
    </Header>
    <InlineMarkdownEdit
      value={description}
      onChange={newValue =>
        updateCard({
          cardId: editingCardId,
          field: 'description',
          newValue: newValue,
        })
      }
    />
  </Container>
)

export default connect(
  (state: State, ownProps: OwnProps) => ({
    title: state.cards[ownProps.editingCardId].title,
    description: state.cards[ownProps.editingCardId].description,
  }),
  {
    updateCard,
  }
)(CardEdit)
