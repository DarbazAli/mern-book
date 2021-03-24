import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { userListReducer, userRegisterReducer } from './reducers/userReducers'

const reducers = combineReducers({
  userList: userListReducer,
  userRegister: userRegisterReducer,
})

const middleware = [thunk]

const store = createStore(
  reducers,

  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
