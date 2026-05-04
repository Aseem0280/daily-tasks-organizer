import { useState } from "react"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/boards")
    } catch (err) {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex items-center justify-center h-full">

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-700 rounded-lg outline-none"
        />

        <button
          onClick={login}
          className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold transition"
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login