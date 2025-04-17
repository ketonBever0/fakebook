import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './ui/Navbar'
import Users from './pages/Users'
import Home from './pages/home'


function App() {


  return (
    <div id='main'>

      <Router>
        <Navbar />
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
