import '../styles/globals.css'
import initAuth from '../initAuth' // initalize Firebase authentication; source: https://github.com/gladly-team/next-firebase-auth#get-started

initAuth()

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
