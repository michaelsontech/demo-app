import {combineReducers} from 'redux'

import {
  // Account update actions
  LOG_IN_FULFILLED,  
  USER_LOGOUT,
} from './actions'

const merge = (prev, next) => Object.assign({}, prev, next)


const userReducer = (state = {}, action) => {
  switch (action.type) {		
		case USER_LOGOUT:
			return {              
				...state,
				isLoggedIn: false,
			}        
		case LOG_IN_FULFILLED:            
			return merge(state, {
				token: action.payload.token,
				user_details: action.payload.user_data.user_details,
				profile_details: action.payload.user_data.profile_details,
				vehicle_info: action.payload.user_data.vehicle_info,
				isLoggedIn: true,
			})        		
		default:
			return state
  }
}

const reducer = combineReducers({
	user: userReducer,
})

export default reducer