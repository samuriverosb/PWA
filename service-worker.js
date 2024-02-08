const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

const saveSubscription = async (subscription) => {
  const response = await fetch('https://push-notification-api.onrender.com/save-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  })

  return response.json();
}

self.addEventListener('install', e => {
  self.skipWaiting();
})

self.addEventListener("activate", async (e) => {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("BE1O7jzVlY0muZM--e2FNfsFtwlFq3ZOi6zYVwOTOgzggr6O0JKyp6f-PmhQP3exaouTaE1Ygca52btFk8nyG6g")
  });

  const response = await saveSubscription(subscription)
  console.log(response);
})

self.addEventListener('push', e => {
  self.registration.showNotification('Hello guys!', { body: e.data.text() })
})


// Public Key:
// BE1O7jzVlY0muZM--e2FNfsFtwlFq3ZOi6zYVwOTOgzggr6O0JKyp6f-PmhQP3exaouTaE1Ygca52btFk8nyG6g

// Private Key:
// ic3XTTG56N9QTvoC4qKEv3LRM7UI2bNUAVAzWJfgGyE