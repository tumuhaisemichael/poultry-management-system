// import { SessionProvider } from "next-auth/react"
// import '../styles/globals.css'

// function MyApp({ Component, pageProps: { session, ...pageProps } }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   )
// }

// export default MyApp

import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        {/* Tailwind CSS CDN for development */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#3B82F6',
                    secondary: '#10B981',
                  }
                }
              }
            }
          `
        }} />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp