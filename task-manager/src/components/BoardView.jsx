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

  if (!board) return <p>Loading...</p>

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-700 px-3 py-1 rounded-lg"
      >
        Back
      </button>

      <h2 className="text-2xl mb-4">{board.name}</h2>

      <div className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New list"
          className="p-2 bg-gray-800 rounded-lg"
        />
        <button
          onClick={addList}
          className="bg-blue-500 px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <motion.div
          layout
          className="flex gap-4 overflow-x-auto"
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