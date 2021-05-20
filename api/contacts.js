import {BASE_URL} from './env'
import { sleep } from './utils'

export const add_contact = async (full_name, phone_number, token) => {    
  var url = BASE_URL + '/api/contacts/contact'
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Token ' +token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      full_name,
      phone_number,
    }),
  })

  var res = await response.json()
  return res
}

export const get_contacts = async (token) => {    
  var url = BASE_URL + '/api/contacts/contact'
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' +token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  })

  var res = await response.json()
  return res
}

