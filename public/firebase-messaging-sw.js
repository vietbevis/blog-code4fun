importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDIPfEDQAkvOoEBmuRcD9aro7SiyTE3Al0',
  authDomain: 'fcm-demo-67907.firebaseapp.com',
  projectId: 'fcm-demo-67907',
  storageBucket: 'fcm-demo-67907.appspot.com',
  messagingSenderId: '193676208341',
  appId: '1:193676208341:web:143a963edd436eb89d5a5c',
  measurementId: 'G-9WR18NZYZX'
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const userName = payload.data?.userName
  const postSlug = payload.data?.postSlug

  const link = `http://localhost:3000/${userName}/${postSlug}`

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
    data: { url: link }
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', function (event) {
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
        return clients.openWindow(url)
      }
    })
  )
})
