// Service Worker para TeeReserve Golf PWA
// Versión 2.1.0 - Optimizado para golf y reservas

const CACHE_NAME = 'teereserve-golf-v2.1.0';
const OFFLINE_URL = '/offline';
const FALLBACK_IMAGE = '/images/course-placeholder.jpg';

// Recursos críticos para cachear inmediatamente
const CRITICAL_RESOURCES = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/logo.png',
  '/images/course-placeholder.jpg'
];

// Recursos de la aplicación para cachear bajo demanda
const APP_RESOURCES = [
  '/courses',
  '/bookings',
  '/profile',
  '/dashboard',
  '/recommendations',
  '/demo/executive-dashboard',
  '/demo/predictive-analytics',
  '/demo/crm-system',
  '/demo/automated-reports'
];

// Recursos estáticos para cachear
const STATIC_RESOURCES = [
  '/css/globals.css',
  '/js/app.js'
];

// URLs de API para estrategia de red primero
const API_URLS = [
  '/api/courses',
  '/api/bookings',
  '/api/weather',
  '/api/user',
  '/api/analytics',
  '/api/crm',
  '/api/reports'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v2.1.0');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cachear recursos críticos
        await cache.addAll(CRITICAL_RESOURCES);
        console.log('[SW] Critical resources cached');
        
        // Forzar activación inmediata
        await self.skipWaiting();
        console.log('[SW] Service Worker installed and activated');
      } catch (error) {
        console.error('[SW] Installation failed:', error);
      }
    })()
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v2.1.0');
  
  event.waitUntil(
    (async () => {
      try {
        // Limpiar cachés antiguos
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
        
        // Tomar control de todos los clientes
        await self.clients.claim();
        console.log('[SW] Service Worker activated and claimed clients');
      } catch (error) {
        console.error('[SW] Activation failed:', error);
      }
    })()
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar peticiones HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Estrategia basada en el tipo de recurso
  if (isAPIRequest(url)) {
    // API: Red primero, caché como respaldo
    event.respondWith(networkFirstStrategy(request));
  } else if (isImageRequest(url)) {
    // Imágenes: Caché primero, red como respaldo
    event.respondWith(cacheFirstStrategy(request));
  } else if (isStaticResource(url)) {
    // Recursos estáticos: Caché primero
    event.respondWith(cacheFirstStrategy(request));
  } else if (isNavigationRequest(request)) {
    // Navegación: Red primero con página offline como respaldo
    event.respondWith(navigationStrategy(request));
  } else {
    // Otros recursos: Red primero
    event.respondWith(networkFirstStrategy(request));
  }
});

// Estrategia: Red primero
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Solo cachear respuestas exitosas
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta de error personalizada para APIs
    if (isAPIRequest(new URL(request.url))) {
      return new Response(
        JSON.stringify({
          error: 'Sin conexión',
          message: 'No hay conexión a internet. Algunos datos pueden estar desactualizados.',
          offline: true
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Estrategia: Caché primero
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Actualizar caché en segundo plano
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Imagen de respaldo para imágenes que fallan
    if (isImageRequest(new URL(request.url))) {
      const fallbackResponse = await caches.match(FALLBACK_IMAGE);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    throw error;
  }
}

// Estrategia: Navegación
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline como último recurso
    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Página offline básica si no está cacheada
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Sin Conexión - TeeReserve Golf</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container {
              max-width: 400px;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { margin: 0 0 20px 0; font-size: 2em; }
            p { margin: 0 0 20px 0; opacity: 0.9; }
            button {
              background: white;
              color: #667eea;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              font-size: 16px;
            }
            .golf-icon { font-size: 4em; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="golf-icon">⛳</div>
            <h1>Sin Conexión</h1>
            <p>No hay conexión a internet. Verifica tu conexión e intenta nuevamente.</p>
            <button onclick="location.reload()">Reintentar</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Actualizar caché en segundo plano
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silenciar errores de actualización en segundo plano
  }
}

// Utilidades para identificar tipos de peticiones
function isAPIRequest(url) {
  return API_URLS.some(apiUrl => url.pathname.startsWith(apiUrl)) ||
         url.pathname.startsWith('/api/');
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname);
}

function isStaticResource(url) {
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(url.pathname) ||
         STATIC_RESOURCES.some(resource => url.pathname === resource);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CACHE_URLS':
      cacheUrls(payload.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
  }
});

// Cachear URLs específicas
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urls);
    console.log('[SW] URLs cached:', urls);
  } catch (error) {
    console.error('[SW] Failed to cache URLs:', error);
  }
}

// Limpiar caché
async function clearCache() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Failed to clear cache:', error);
  }
}

// Obtener estado del caché
async function getCacheStatus() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    return {
      version: CACHE_NAME,
      cachedUrls: keys.length,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    return {
      version: CACHE_NAME,
      cachedUrls: 0,
      error: error.message
    };
  }
}

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  let notificationData = {
    title: 'TeeReserve Golf',
    body: 'Tienes una nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'teereserve-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Descartar',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data || {};
  
  if (action === 'dismiss') {
    return;
  }
  
  let urlToOpen = '/';
  
  if (action === 'view' && notificationData.url) {
    urlToOpen = notificationData.url;
  } else if (notificationData.url) {
    urlToOpen = notificationData.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Buscar ventana existente
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        
        // Abrir nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sincronizar datos pendientes
    console.log('[SW] Performing background sync');
    
    // Aquí se implementaría la lógica de sincronización
    // Por ejemplo, enviar reservas pendientes, actualizar datos, etc.
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

console.log('[SW] Service Worker v2.1.0 loaded successfully');

