export const executeDbSyncedAction = (onSuccess: (objectStore: any) => void, mode: 'readonly' | 'readwrite' = 'readonly'): void => {
  const request = window.indexedDB.open('notes', 1);

  request.onerror = (event: any) => {
    console.error('Database error: ', event.target.error);
  };

  request.onupgradeneeded = (event: any) => {
    const db = event.target.result;
    const objectStore = db.createObjectStore('notes', { keyPath: 'id' });
    objectStore.createIndex('text', 'text', { unique: false });
  };

  request.onsuccess = (event: any) => {
    const db = event.target.result;
    const transaction = db.transaction('notes', mode);
    const objectStore = transaction.objectStore('notes');
    onSuccess(objectStore);
  };
}