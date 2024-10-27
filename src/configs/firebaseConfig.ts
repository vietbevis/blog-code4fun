import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

import envConfig from './envConfig'

const firebaseConfig = {
  apiKey: 'AIzaSyDIPfEDQAkvOoEBmuRcD9aro7SiyTE3Al0',
  authDomain: 'fcm-demo-67907.firebaseapp.com',
  projectId: 'fcm-demo-67907',
  storageBucket: 'fcm-demo-67907.appspot.com',
  messagingSenderId: '193676208341',
  appId: '1:193676208341:web:143a963edd436eb89d5a5c',
  measurementId: 'G-9WR18NZYZX'
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
