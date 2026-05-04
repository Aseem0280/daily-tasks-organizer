import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { motion } from "framer-motion"

function Card({ card, listId, lists, setLists }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id
  })

  const [edit, setEdit] = useState(false)
  const [text, setText] = useState(card.text)

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined
  }

  const updateCard = async () => {
    const newLists = lists.map(list =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.map(c =>
              c.id === card.id ? { ...c, text } : c
            )
          }
        : list
    )

    await setLists(newLists)
    setEdit(false)
  }

  const deleteCard = async () => {
    const newLists = lists.map(list =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.filter(c => c.id !== card.id)
          }
        : list
    )

    await setLists(newLists)
  }

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      layout
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-700 p-3 rounded-lg cursor-grab"
    >
      {edit ? (
        <>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-gray-600 p-1 rounded"
          />
          <button
            onClick={updateCard}
            className="text-green-400 text-sm mt-1"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p className="text-sm">{card.text}</p>

          <div className="flex justify-between text-xs mt-2">
            <button
              onClick={() => setEdit(true)}
              className="text-yellow-400"
            >
              Edit
            </button>
            <button
              onClick={deleteCard}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default Card