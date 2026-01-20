import { combineReducers } from 'redux'
import BaseMapReducer from './BaseMapReducer'
import TypeMapReducer from './TypeMapReducer'
const RootReducer = combineReducers({
  baseMap: BaseMapReducer,
  typeMapList: TypeMapReducer,
})
export default RootReducer
