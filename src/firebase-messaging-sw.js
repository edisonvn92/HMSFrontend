// the number of version matching with firebase in package.json
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

const actionClick = '/doctor/alert-list';
const titleNotification = {
  en: 'There is a patient detected by the alert condition',
  ja: 'アラート条件で検知された患者様がいます',
};

function handleWhenNotificationClicked(event) {
  event.notification.close();
  // This looks to see if the current is already open and
  event.waitUntil(self.clients.openWindow(actionClick));
}

self.removeEventListener('notificationclick', handleWhenNotificationClicked);

// Notification click event listener
self.addEventListener('notificationclick', handleWhenNotificationClicked);

function handleWhenPushNotification(event) {
  const language = navigator.language;
  const title = language === 'ja' ? titleNotification.ja : titleNotification.en;

  event.waitUntil(
    self.registration.showNotification(title, {
      click_action: actionClick,
    })
  );
}

self.removeEventListener('push', handleWhenPushNotification);

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', handleWhenPushNotification);

firebase.initializeApp({
  apiKey: 'AIzaSyBU-zTNUwlV7pZE4THrC8u1P361BFCWl14',
  projectId: 'ohq-hms2-stg',
  messagingSenderId: '11545619887',
  appId: '1:11545619887:web:7a0081dd0f24a0d7fd535a',
});

const messaging = firebase.messaging();
