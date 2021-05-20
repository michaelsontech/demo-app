import * as SecureStore from 'expo-secure-store'

import {
  // Account update actions
  LOG_IN_FULFILLED,
  USER_LOGOUT,

} from './actions'

import {
  login,
  log_out,
} from '../api/auth'



// Accounts Action Creators

export const logOut = () => async dispatch => {
  var token = await SecureStore.getItemAsync('token')
  const response = await log_out(token)
  var res = await response.json()
  if (res.status === 'success') {
    var is_available = await SecureStore.isAvailableAsync()

    if (is_available) {      
      SecureStore.deleteItemAsync('token')
      dispatch({type: USER_LOGOUT})
    }
  }
}

export const logInUser = (email, password) => async dispatch => {
  // login action creator

  const response = await login(email, password)
  if (response.ok) {
    var res = await response.json()

    var is_available = await SecureStore.isAvailableAsync()

    if (is_available) {
      console.log(res.token)
      SecureStore.setItemAsync('token', res.token)
      .then(() => {
        dispatch({type: LOG_IN_FULFILLED, payload: res})
      })
    }  

    return res
  } else {
    var err = await response.json()            
    return err
  }
}
