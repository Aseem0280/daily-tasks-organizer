import { useEffect, useState } from "react"
import { db } from "../firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"
import List from "./List"
import { DndContext } from "@dnd-kit/core"
import { motion } from "framer-motion"

function BoardView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    const fetchBoard = async () => {
      const snapshot = await getDoc(doc(db, "boards", id))

      if (snapshot.exists()) {
        const data = snapshot.data()
        setBoard(data)
        setLists(data.lists || [])
      }
    }

    fetchBoard()
  }, [id])

  const saveToFirebase = async (newLists) => {
    setLists(newLists)
    await updateDoc(doc(db, "boards", id), {
      lists: newLists
    })
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over) return

    let sourceList, targetList

    lists.forEach(list => {
      if (list.cards.find(c => c.id === active.id)) sourceList = list
      if (list.id === over.id) targetList = list
    })

    if (!sourceList || !targetList) return

    const dragged = sourceList.cards.find(c => c.id === active.id)

    const newLists = lists.map(list => {
      if (list.id === sourceList.id) {
        return {
          ...list,
          cards: list.cards.filter(c => c.id !== active.id)
        }
      }
      if (list.id === targetList.id) {
        return {
          ...list,
          cards: [...list.cards, dragged]
        }
      }
      return list
    })

    await saveToFirebase(newLists)
  }

  const addList = async () => {
    if (!title) return

    const newLists = [
      ...lists,
      { id: Date.now().toString(), title, cards: [] }
    ]

    await saveToFirebase(newLists)
    setTitle("")
  }

  if (!board)
    return (
      <div className="text-center mt-10 text-gray-400">
        Loading board...
      </div>
    )

  return (
    <div className="h-full flex flex-col">

      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{board.name}</h2>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-lg transition"
        >
          Back
        </button>
      </div>

      {/* 🔹 Add List */}
      <div className="flex gap-3 mb-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add new list..."
          className="p-2 bg-gray-800 rounded-lg outline-none w-60"
        />

        <button
          onClick={addList}
          className="bg-blue-500 hover:bg-blue-600 px-4 rounded-lg transition"
        >
          Add List
        </button>
      </div>

      {/* 🔹 Lists Section */}
      <DndContext onDragEnd={handleDragEnd}>
        <motion.div
          layout
          className="flex gap-6 overflow-x-auto pb-4 flex-1"
        >
          {lists.map(list => (
            <List
              key={list.id}
              list={list}
              lists={lists}
              setLists={saveToFirebase}
            />
          ))}
        </motion.div>
      </DndContext>
    </div>
  )
}

export default BoardView