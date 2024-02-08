const checkPersmission = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error("No support for service worker")
  }

  if (!('Notification' in window)) {
    throw new Error('No Notification API Support')
  }
}

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register('./service-worker.js');
  return registration;
}

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification Permit not granted')
  }
}

const main = async () => {
  checkPersmission();
  await requestNotificationPermission();
  await registerServiceWorker();
}