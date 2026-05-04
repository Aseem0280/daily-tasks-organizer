import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import Card from "./Card"

function List({ list, lists, setLists }) {
  const { setNodeRef } = useDroppable({ id: list.id })

  const [text, setText] = useState("")
  const [priority, setPriority] = useState("low")
  const [deadline, setDeadline] = useState("")

  const addCard = async () => {
    if (!text) return

    const newCard = {
      id: Date.now().toString(),
      text,
      priority,
      deadline
    }

    const newLists = lists.map(l =>
      l.id === list.id
        ? { ...l, cards: [...l.cards, newCard] }
        : l
    )

    await setLists(newLists)

    setText("")
    setPriority("low")
    setDeadline("")
  }

  const deleteList = async () => {
    const newLists = lists.filter(l => l.id !== list.id)
    await setLists(newLists)
  }

  return (
    <div ref={setNodeRef} className="bg-gray-800 p-4 rounded-xl w-72">
      
      <div className="flex justify-between mb-2">
        <h3>{list.title}</h3>
        <button onClick={deleteList}>✕</button>
      </div>

      {list.cards.map(card => (
        <Card
          key={card.id}
          card={card}
          listId={list.id}
          lists={lists}
          setLists={setLists}
        />
      ))}

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Task"
        className="mt-2 w-full p-2 bg-gray-700 rounded"
      />

      <div className="flex gap-2 mt-2">
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="bg-gray-700 p-1 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="bg-gray-700 p-1 rounded"
        />
      </div>

      <button
        onClick={addCard}
        className="mt-2 w-full bg-blue-500 p-2 rounded"
      >
        Add
      </button>
    </div>
  )
}

export default List