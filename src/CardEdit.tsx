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
  background-color: #5c616c;
  min-height: 100%;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: rgb(82, 82, 82);
  min-height: 32px;
`

const Button = styled.button`
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 3px;
  cursor: pointer;
  background-color: rgb(44, 44, 44);
  &:hover {
    background-color: rgb(60, 60, 60);
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
