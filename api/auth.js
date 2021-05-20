import * as SecureStore from 'expo-secure-store'

import {BASE_URL} from './env'
import { sleep } from './utils'

export const login = async (email, password) => {    
  var url = BASE_URL + '/api/account/login'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  return response
}

export const log_out = async (token) => {
  var url = BASE_URL + '/api/account/log_out'
  console.log(token)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' +token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  })

  return response
}



