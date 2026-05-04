import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import BoardList from "./components/BoardList"
import BoardView from "./components/BoardView"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">

        {/* Sidebar */}
        <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-6">TaskFlow</h1>

            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="hover:bg-gray-700 p-2 rounded-lg transition"
              >
                Boards
              </Link>

              <Link
                to="/dashboard"
                className="hover:bg-gray-700 p-2 rounded-lg transition"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-center p-2 rounded-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<BoardList />} />
            <Route path="/board/:id" element={<BoardView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  )
}

export default App