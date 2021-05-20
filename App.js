import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// import AppLoading from 'expo-app-loading'
import { connect } from 'react-redux'


import AppNavigator from './AppNavigator'
import {store, persistor} from './redux/store'

export default class App extends React.Component {
  render () {
    return (
      <Provider style={{backgroundColor: '#fff'}} store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator/>
      </PersistGate>
      </Provider>
    )
  }
}

