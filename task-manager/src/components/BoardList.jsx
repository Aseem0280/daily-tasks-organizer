import { useEffect, useState } from "react"
import { db } from "../firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function BoardList() {
  const [boards, setBoards] = useState([])
  const [name, setName] = useState("")
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const fetchBoards = async () => {
      const q = query(
        collection(db, "boards"),
        where("userId", "==", user.uid)
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setBoards(data)
    }

    fetchBoards()
  }, [user])

  const addBoard = async () => {
    if (!name || !user) return

    const docRef = await addDoc(collection(db, "boards"), {
      name,
      userId: user.uid,
      lists: []
    })

    setBoards([...boards, { id: docRef.id, name, lists: [] }])
    setName("")
  }

  if (loading) return <p>Loading...</p>
  if (!user) return <p>Please login</p>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Boards</h2>

      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New board"
          className="p-3 bg-gray-800 rounded-lg"
        />
        <button
          onClick={addBoard}
          className="bg-blue-500 px-5 rounded-lg"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {boards.map(b => (
          <div
            key={b.id}
            onClick={() => navigate(`/board/${b.id}`)}
            className="bg-gray-800 p-5 rounded-xl cursor-pointer hover:bg-gray-700 transition"
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardList