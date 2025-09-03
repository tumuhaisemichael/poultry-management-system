import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Poultry Management System</h1>
      
      {session ? (
        <div className="text-center">
          <p className="mb-4">Welcome, {session.user.name}!</p>
          <button 
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">Please sign in to access the system</p>
          <button 
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}