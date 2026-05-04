import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase"

export const getUserBoards = async (userId) => {
  const q = query(
    collection(db, "boards"),
    where("userId", "==", userId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}