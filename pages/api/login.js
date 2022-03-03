// ./pages/api/login
// source: https://github.com/gladly-team/next-firebase-auth#get-started

import { setAuthCookies } from 'next-firebase-auth'
import initAuth from '../../initAuth' // the module you created above

initAuth()

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default handler