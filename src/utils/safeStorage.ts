/**
 * Safe LocalStorage wrapper to prevent quota exceeded errors with large academic datasets.
 */

export function safeSetStorage(key: string, value: any): void {
  try {
    let dataToStore = value;

    // If storing books, strip heavy full-text and pages arrays to stay well under 5MB browser storage limits
    if (key === 'econ_books' && Array.isArray(value)) {
      dataToStore = value.map((book: any) => {
        // Keep essential metadata only for fast instant hydration
        const { pages, fullRawText, ...meta } = book;
        return meta;
      });
    }

    const stringified = typeof dataToStore === 'string' ? dataToStore : JSON.stringify(dataToStore);
    localStorage.setItem(key, stringified);
  } catch (err) {
    console.warn(`[SafeStorage] Could not write "${key}" to localStorage (quota or storage disabled):`, err);
    // If still failing, attempt to remove stale bloated items
    try {
      if (key === 'econ_books') {
        localStorage.removeItem('econ_books');
      }
    } catch {
      // Ignore
    }
  }
}

export function safeGetStorage<T = any>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[SafeStorage] Could not read "${key}" from localStorage:`, err);
    return fallback;
  }
}
