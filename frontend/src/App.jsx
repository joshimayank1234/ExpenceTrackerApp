import React from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import NavBar from "./components/NavBar"
import Home from './Pages/Home'
import MyExpences from './Pages/MyExpences'
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/MyExpences' element={<MyExpences/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
