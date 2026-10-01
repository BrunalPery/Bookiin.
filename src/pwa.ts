/**
 * PWA Service Worker Registration & Offline Management
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // In development mode or inside the AI Studio preview iframe, do NOT register
  // the service worker as it intercepts Vite's hot-reload and dynamic module requests.
  // Actively unregister any stale workers and clear caches to guarantee the preview renders.
  const isDevOrIframe = import.meta.env.DEV || (typeof window !== 'undefined' && window.self !== window.top);

  if (isDevOrIframe) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.info('[PWA] Unregistered dev/iframe service worker to ensure live preview.');
          }
        });
      }
    }).catch(() => {
      // Ignore unregister errors in sandboxed iframes
    });

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (key.startsWith('bookiin-')) {
            caches.delete(key);
          }
        });
      }).catch(() => {
        // Ignore cache deletion errors in sandboxed iframes
      });
    }
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                window.dispatchEvent(new CustomEvent('pwa-update-available'));
              }
            };
          }
        };
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });
  });
}

