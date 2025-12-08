import { Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import EditStudent from './EditStudent'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit/:id" element={<EditStudent />} />
      </Routes>
    </div>
  )
}

export default App
