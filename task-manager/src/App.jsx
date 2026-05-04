import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"
import BoardList from "./components/BoardList"
import BoardView from "./components/BoardView"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-900 text-white">

        <div className="w-64 bg-gray-800 p-5 flex flex-col gap-6">
          <h1 className="text-2xl font-bold">TaskFlow</h1>

          <nav className="flex flex-col gap-3">
            <Link to="/boards">Boards</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <Link to="/login" className="mt-auto bg-blue-500 p-2 text-center rounded">
            Logout
          </Link>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/boards" element={<BoardList />} />
            <Route path="/board/:id" element={<BoardView />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App