importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBtE1onBWp6CMJo4o_MGyGZ3Y1CntaCJHE',
  authDomain: 'blogs-app-c7df7.firebaseapp.com',
  projectId: 'blogs-app-c7df7',
  storageBucket: 'blogs-app-c7df7.appspot.com',
  messagingSenderId: '777253255711',
  appId: '1:777253255711:web:1e3039ad88ba89145b732a',
  measurementId: 'G-EPWMP566DQ'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  const link = payload.fcmOptions?.link || payload.data?.link

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
    data: { url: link }
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Notification click received.')

  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      const url = event.notification.data.url

      if (!url) return

      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }

      if (clients.openWindow) {
        console.log('OPENWINDOW ON CLIENT')
        return clients.openWindow(url)
      }
    })
  )
})
