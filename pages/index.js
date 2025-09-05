import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import Head from "next/head"

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Poultry Management System</title>
        <meta name="description" content="Manage your poultry farming operations efficiently" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">PoultryPro Manager</h1>
            </div>
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                  <span className="text-xs text-gray-500">Farm Administrator</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {session.user.name.charAt(0)}
                </div>
                <button 
                  onClick={() => signOut()}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link href="/auth/register">
                  <button className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors">
                    Register
                  </button>
                </Link>
                <button 
                  onClick={() => signIn()}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {session ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Farm Management Dashboard</h2>
                <p className="text-gray-600">Welcome back, {session.user.name}. Manage your poultry operation efficiently.</p>
              </div>
              
              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/batches">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="bg-blue-100 rounded-lg p-2 w-10 h-10 mb-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-800">Manage Batches</p>
                      <p className="text-sm text-gray-500">View and manage all poultry batches</p>
                    </div>
                  </Link>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-green-100 rounded-lg p-2 w-10 h-10 mb-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Record Health Check</p>
                    <p className="text-sm text-gray-500">Log health status for a batch</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-purple-100 rounded-lg p-2 w-10 h-10 mb-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800">Generate Report</p>
                    <p className="text-sm text-gray-500">Create performance reports</p>
                  </div>
                </div>
              </div>
              
              {/* Main Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/batches">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow group">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 rounded-lg p-2 mr-4 group-hover:bg-blue-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Batch Management</h2>
                    </div>
                    <p className="text-gray-600 mb-4">View and manage your poultry batches, track growth metrics, and monitor health status.</p>
                    <div className="text-blue-600 font-medium flex items-center">
                      <span>Manage batches</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
                
                <Link href="/analytics">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow group">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 rounded-lg p-2 mr-4 group-hover:bg-green-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Analytics & Reports</h2>
                    </div>
                    <p className="text-gray-600 mb-4">Access detailed reports, performance analytics, and financial insights for your operation.</p>
                    <div className="text-blue-600 font-medium flex items-center">
                      <span>View reports</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto border border-gray-100">
              <div className="text-center mb-10">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">PoultryPro Manager</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Streamline your poultry farming operations with our comprehensive management system. 
                  Track batches, monitor health, and analyze performance all in one place.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Batch Tracking</h3>
                  <p className="text-gray-600 text-sm">Monitor all your poultry batches from day one to market</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWeight={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Health Monitoring</h3>
                  <p className="text-gray-600 text-sm">Track health metrics and receive alerts for potential issues</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Performance Analytics</h3>
                  <p className="text-gray-600 text-sm">Gain insights with detailed reports and performance metrics</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-6">Get started today and take control of your poultry farming operation</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/auth/register">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors shadow-sm">
                      Create Account
                    </button>
                  </Link>
                  <button 
                    onClick={() => signIn()}
                    className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 rounded-lg text-base font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}