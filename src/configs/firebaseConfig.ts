import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

import envConfig from './envConfig'

const firebaseConfig = {
  apiKey: 'AIzaSyBtE1onBWp6CMJo4o_MGyGZ3Y1CntaCJHE',
  authDomain: 'blogs-app-c7df7.firebaseapp.com',
  projectId: 'blogs-app-c7df7',
  storageBucket: 'blogs-app-c7df7.appspot.com',
  messagingSenderId: '777253255711',
  appId: '1:777253255711:web:1e3039ad88ba89145b732a',
  measurementId: 'G-EPWMP566DQ'
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

const messaging = async () => {
  const supported = await isSupported()
  return supported ? getMessaging(app) : null
}

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging()
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: envConfig.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY
      })
      return token
    }
    return null
  } catch (err) {
    console.error('An error occurred while fetching the token:', err)
    return null
  }
}

export { app, messaging }
