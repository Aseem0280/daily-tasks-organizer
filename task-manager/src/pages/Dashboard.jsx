import { useEffect, useState } from "react"
import { db } from "../firebase"
import { collection, getDocs } from "firebase/firestore"

function Dashboard() {
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalLists: 0,
    totalTasks: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "boards"))

      let lists = 0
      let tasks = 0

      snapshot.docs.forEach(doc => {
        const data = doc.data()
        lists += data.lists?.length || 0
        data.lists?.forEach(l => {
          tasks += l.cards?.length || 0
        })
      })

      setStats({
        totalBoards: snapshot.size,
        totalLists: lists,
        totalTasks: tasks
      })
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2 className="text-2xl mb-4">Dashboard</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded">Boards: {stats.totalBoards}</div>
        <div className="bg-gray-800 p-4 rounded">Lists: {stats.totalLists}</div>
        <div className="bg-gray-800 p-4 rounded">Tasks: {stats.totalTasks}</div>
      </div>
    </div>
  )
}

export default Dashboard