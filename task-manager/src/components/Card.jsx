import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"

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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-gray-700 p-3 rounded mb-2"
    >
      {edit ? (
        <>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-gray-600 p-1"
          />
          <button onClick={updateCard}>Save</button>
        </>
      ) : (
        <>
          <p>{card.text}</p>

          <div className="flex justify-between text-xs mt-2">
            <span
              className={
                card.priority === "high"
                  ? "text-red-400"
                  : card.priority === "medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }
            >
              {card.priority}
            </span>

            <span>{card.deadline || "No date"}</span>
          </div>

          <div className="flex justify-between mt-2 text-xs">
            <button onClick={() => setEdit(true)}>Edit</button>
            <button onClick={deleteCard}>Delete</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Card