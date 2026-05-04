import { useEffect, useState } from "react"
import { db } from "../firebase"
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore"

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts"

import useAuth from "../hooks/useAuth"

function Dashboard() {
  const { user, loading } = useAuth()

  const [data, setData] = useState([])
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalTasks: 0,
    completed: 0
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const q = query(
        collection(db, "boards"),
        where("userId", "==", user.uid)
      )

      const snapshot = await getDocs(q)

      let todo = 0, doing = 0, done = 0
      let totalTasks = 0

      snapshot.docs.forEach(doc => {
        const board = doc.data()

        board.lists?.forEach(list => {
          const count = list.cards.length
          totalTasks += count

          const title = list.title.toLowerCase()

          if (title.includes("todo")) todo += count
          else if (title.includes("doing")) doing += count
          else if (title.includes("done")) done += count
        })
      })

      setStats({
        totalBoards: snapshot.size,
        totalTasks,
        completed: done
      })

      setData([
        { name: "Todo", value: todo },
        { name: "Doing", value: doing },
        { name: "Done", value: done }
      ])
    }

    fetchData()
  }, [user])

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981"]

  if (loading) return <p>Loading dashboard...</p>
  if (!user) return <p>Please login</p>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400">Total Boards</p>
          <h3 className="text-2xl font-bold">{stats.totalBoards}</h3>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400">Total Tasks</p>
          <h3 className="text-2xl font-bold">{stats.totalTasks}</h3>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <p className="text-gray-400">Completed</p>
          <h3 className="text-2xl font-bold text-green-400">
            {stats.completed}
          </h3>
        </div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-gray-800 p-5 rounded-xl">
          <h3 className="mb-4">Task Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={80}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl">
          <h3 className="mb-4">Tasks Overview</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default Dashboard