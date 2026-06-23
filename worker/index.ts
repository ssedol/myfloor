// @ts-nocheck
const sw = self;

sw.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {
    title: "⏰ 주차 알림",
    body: "주차 시간을 확인하세요.",
  };
  event.waitUntil(
    sw.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo.png",
      badge: "/logo.png",
      tag: data.tag ?? "parking-alert",
      renotify: true,
    })
  );
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    sw.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        return sw.clients.openWindow("/");
      })
  );
});
