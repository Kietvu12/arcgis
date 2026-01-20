import logo from './logo.svg'
import './App.css'
import RootMap from './component/map/RootMap'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App () {
  return (
    <div className='App position-relative h-100 ml-25' >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RootMap />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
