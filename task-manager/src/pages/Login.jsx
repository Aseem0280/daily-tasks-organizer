import { useState } from "react"
import { auth } from "../firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    alert("Logged in")
  }

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login} className="bg-blue-500 p-2">Login</button>
    </div>
  )
}

export default Login