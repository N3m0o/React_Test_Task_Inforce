import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {ProductList} from './pages/ProductList'
import {ProductPage} from './pages/ProductPage'
import './App.css'

function App() {

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>My Product Shop</h1>
        </header>

        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
