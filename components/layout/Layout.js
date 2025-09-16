import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Head from "next/head";

export default function Layout({ children }) {
  const { data: session } = useSession();

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
          {children}
        </main>
      </div>
    </>
  );
}
