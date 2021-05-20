import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
// import AsyncStorage from '@react-native-community/async-storage'j
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducer from './reducer'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)
const DEFAULT_STATE = {
  user: {
    user_details: {},
    isLoggedIn: false,
  },
  
}

export const store = createStore(persistedReducer, DEFAULT_STATE, applyMiddleware(thunk))
// export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor = persistStore(store)