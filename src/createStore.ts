import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import createElectronStorage from 'redux-persist-electron-storage'
import { reducer } from './reducer'

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
