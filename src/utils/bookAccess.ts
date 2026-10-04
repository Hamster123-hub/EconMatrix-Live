// Book Access Control, DRM, and Purchase State Utilities

export interface BookPurchaseRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amountLKR: number;
  paymentMethod: string;
  accessCode: string;
  invoiceNumber?: string;
  purchasedAt: string;
  status: 'PAID_CONFIRMED' | 'PENDING' | 'CANCELLED';
}

const STORAGE_PREFIX = 'econ_book_access_';

/**
 * Check if the given book ID has active unlocked access on this device
 */
export function isBookPurchased(bookId: string): boolean {
  if (!bookId) return false;
  try {
    // Check specific book purchase
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${bookId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed.accessCode || parsed.status === 'PAID_CONFIRMED')) {
        return true;
      }
    }

    // Check all purchases store
    const allPurchases = localStorage.getItem('econ_all_book_purchases');
    if (allPurchases) {
      const list: BookPurchaseRecord[] = JSON.parse(allPurchases);
      if (Array.isArray(list) && list.some(p => p.bookId === bookId && p.status === 'PAID_CONFIRMED')) {
        return true;
      }
    }
  } catch (e) {
    console.warn('Error reading book purchase state:', e);
  }
  return false;
}

/**
 * Retrieve saved purchase record for a given book
 */
export function getBookPurchase(bookId: string): BookPurchaseRecord | null {
  if (!bookId) return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${bookId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Error reading book purchase details:', e);
  }
  return null;
}

/**
 * Store a verified purchase record locally
 */
export function recordBookPurchase(record: BookPurchaseRecord): void {
  if (!record || !record.bookId) return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${record.bookId}`, JSON.stringify(record));

    // Also append to all purchases list
    const allStored = localStorage.getItem('econ_all_book_purchases');
    let list: BookPurchaseRecord[] = allStored ? JSON.parse(allStored) : [];
    if (!Array.isArray(list)) list = [];
    // Replace existing if any
    list = list.filter(p => p.id !== record.id && p.accessCode !== record.accessCode);
    list.unshift(record);
    localStorage.setItem('econ_all_book_purchases', JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving book purchase record:', e);
  }
}
