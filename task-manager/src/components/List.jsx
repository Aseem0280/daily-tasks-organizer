import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import Card from "./Card"
import { motion } from "framer-motion"

function List({ list, lists, setLists }) {
  const { setNodeRef } = useDroppable({ id: list.id })
  const [text, setText] = useState("")

  const addCard = async () => {
    if (!text) return

    const newLists = lists.map(l =>
      l.id === list.id
        ? {
            ...l,
            cards: [...l.cards, { id: Date.now().toString(), text }]
          }
        : l
    )

    await setLists(newLists)
    setText("")
  }

  const deleteList = async () => {
    const newLists = lists.filter(l => l.id !== list.id)
    await setLists(newLists)
  }

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 p-4 rounded-xl w-72 shadow-lg"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{list.title}</h3>
        <button onClick={deleteList} className="text-red-400">✕</button>
      </div>

      <div className="flex flex-col gap-2">
        {list.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            listId={list.id}
            lists={lists}
            setLists={setLists}
          />
        ))}
      </div>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New Task"
        className="mt-3 w-full p-2 bg-gray-700 rounded-lg text-sm"
      />

      <button
        onClick={addCard}
        className="mt-2 w-full bg-blue-500 hover:bg-blue-600 transition p-2 rounded-lg"
      >
        Add
      </button>
    </motion.div>
  )
}

export default List