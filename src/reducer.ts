import { createAction, handleAction, reduceReducers } from 'redux-ts-utils'
import {
  Card,
  CardColumn,
  ColumnMove,
  CardMove,
  CardUpdate,
  ColumnUpdate,
} from './types'
import shortid from 'shortid'

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const addList = createAction<CardColumn>('ADD_LIST', () => ({
  id: shortid.generate(),
  title: 'New list',
  cardIds: [],
}))

export const reorderList = createAction<ColumnMove>('REORDER_LIST')
export const moveCard = createAction<CardMove>('MOVE_CARD')
export const updateCard = createAction<CardUpdate>('UPDATE_CARD')
type AddCardPayload = {
  cardId: string
  listId: string
  title: string
}
export const addCard = createAction<AddCardPayload, string[]>(
  'ADD_CARD',
  (listId, cardId) => ({
    cardId,
    listId,
    title: 'New card',
  })
)
export const updateColumn = createAction<ColumnUpdate>('UPDATE_COLUMN')
export const deleteColumn = createAction<string>('DELETE_COLUMN')
export const deleteCard = createAction<string>('DELETE_CARD')
const initialState: State = {
  cards: {
    jdkfds: {
      id: 'jdkfds',
      title: 'New card',
      description: '',
    },
  },
  columns: [
    { id: 'kjkhk', title: 'New list', cardIds: ['jdkfds'] },
    { id: 'dsa', title: 'asx', cardIds: [] },
  ],
}
const findColumnWithId = (columns: CardColumn[], id: string) =>
  columns.find(column => column.id === id)
export const reducer = reduceReducers<State>(
  [
    handleAction(addList, (state, { payload }) => {
      state.columns.push(payload)
    }),
    handleAction(reorderList, (state: State, { payload }) => {
      state.columns = reorder(
        state.columns,
        payload.sourceIndex,
        payload.destinationIndex
      )
    }),
    handleAction(moveCard, (state, { payload }) => {
      const sourceColumn = findColumnWithId(
        state.columns,
        payload.sourceListId
      )!
      if (payload.sourceListId === payload.destinationListId) {
        sourceColumn.cardIds = reorder(
          sourceColumn.cardIds,
          payload.sourceIndex,
          payload.destinationIndex
        )
      } else {
        sourceColumn.cardIds.splice(payload.sourceIndex, 1)
        const destinationColumn = findColumnWithId(
          state.columns,
          payload.destinationListId
        )!
        destinationColumn.cardIds.splice(
          payload.destinationIndex,
          0,
          payload.cardId
        )
      }
    }),
    handleAction(updateCard, (state, { payload }) => {
      state.cards[payload.cardId][payload.field] = payload.newValue
    }),
    handleAction(addCard, (state, { payload }) => {
      state.cards[payload.cardId] = {
        id: payload.cardId,
        title: payload.title,
        description: '',
      }
      findColumnWithId(state.columns, payload.listId)!.cardIds.push(
        payload.cardId
      )
    }),
    handleAction(updateColumn, (state, { payload }) => {
      findColumnWithId(state.columns, payload.columnId)![payload.field] =
        payload.newValue
    }),
    handleAction(deleteColumn, (state, { payload }) => {
      const column = findColumnWithId(state.columns, payload)!
      column.cardIds.forEach(cardId => {
        delete state.cards[cardId]
      })
      const index = state.columns.indexOf(column)
      state.columns.splice(index, 1)
    }),
    handleAction(deleteCard, (state, { payload }) => {
      delete state.cards[payload]
      state.columns.forEach(column => {
        column.cardIds = column.cardIds.filter(id => id !== payload)
      })
    }),
  ],
  initialState
)
export type State = {
  cards: {
    [id: string]: Card
  }
  columns: CardColumn[]
}
