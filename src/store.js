import { createStore } from 'redux'
import RootReducer from './component/reducer/RootReducer'
const store = createStore(RootReducer)

export default store