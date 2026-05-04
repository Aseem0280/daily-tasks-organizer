import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function BoardList() {
  const [boards, setBoards] = useState([])
  const [name, setName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBoards = async () => {
      const snapshot = await getDocs(collection(db, "boards"))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setBoards(data)
    }

    fetchBoards()
  }, [])

  const addBoard = async () => {
    if (!name) return

    const docRef = await addDoc(collection(db, "boards"), {
      name: name,
      lists: []
    })

    setBoards([...boards, { id: docRef.id, name, lists: [] }])
    setName("")
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Boards</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New board name"
          className="p-2 bg-gray-800 rounded-lg"
        />
        <button
          onClick={addBoard}
          className="bg-blue-500 px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {boards.map(b => (
          <div
            key={b.id}
            onClick={() => navigate(`/board/${b.id}`)}
            className="bg-gray-800 p-4 rounded-xl cursor-pointer hover:bg-gray-700 transition shadow-lg"
          >
            {b.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BoardList