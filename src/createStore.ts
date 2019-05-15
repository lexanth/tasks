import { createStore } from 'redux'
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
import { persistStore, persistReducer } from 'redux-persist'
import createElectronStorage from 'redux-persist-electron-storage'
import { stat } from 'fs'

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
export const updateColumn = createAction<ColumnUpdate>('UPDATE_COLUMN')

export const deleteColumn = createAction<string>('DELETE_COLUMN')

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
  ],
  initialState
)

export type State = {
  cards: { [id: string]: Card }
  columns: CardColumn[]
}

const persistConfig = {
  key: 'root',
  storage: createElectronStorage(),
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(
  persistedReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)
export const persistor = persistStore(store)
