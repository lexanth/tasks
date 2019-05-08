import { createStore } from 'redux'
import { createAction, handleAction, reduceReducers } from 'redux-ts-utils'
import { Card, CardColumn, ColumnMove, CardMove, CardUpdate } from './types'
import shortid from 'shortid'
import { string } from 'prop-types'

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
export const addCard = createAction<
  {
    cardId: string
    listId: string
    title: string
  },
  [string]
>('ADD_CARD', listId => ({
  cardId: shortid.generate(),
  listId,
  title: 'New card',
}))

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

const reducer = reduceReducers<State>(
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
      // TODO
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
  ],
  initialState
)

export type State = {
  cards: { [id: string]: Card }
  columns: CardColumn[]
}

const store = createStore(
  reducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
export default store
