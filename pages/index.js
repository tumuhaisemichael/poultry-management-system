import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Poultry Management System</h1>
          {session ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {session.user.name}</span>
              <button 
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/auth/register">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Register
                </button>
              </Link>
              <button 
                onClick={() => signIn()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Link href="/batches">
  <div className="bg-white overflow-hidden shadow rounded-lg p-6 cursor-pointer hover:bg-gray-50">
    <h2 className="text-xl font-semibold mb-2">Batch Management</h2>
    <p>View and manage your poultry batches</p>
  </div>
</Link>
            <Link href="/analytics">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                <p>View reports and insights</p>
              </div>
            </Link>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
              <p>Your dashboard will show quick statistics here</p>
            </div>
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Poultry Management System</h2>
            <p className="mb-6">Please register or sign in to access your account and manage your poultry business.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/register">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg">
                  Register
                </button>
              </Link>
              <button 
                onClick={() => signIn()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}