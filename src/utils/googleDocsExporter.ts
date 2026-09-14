import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize auth with browserLocalPersistence and inMemoryPersistence to prevent IndexedDB closing/hidden errors when page visibility changes
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence],
  });
} catch {
  auth = getAuth(app);
}

let cachedAccessToken: string | null = null;

export const generateGoogleDocReport = async (reportContentText: string): Promise<{ documentId: string; documentUrl: string }> => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/documents');
  provider.addScope('https://www.googleapis.com/auth/drive.file');

  let accessToken = cachedAccessToken;

  if (!accessToken) {
    let result;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      // If IndexedDB closed or tab was hidden during popup open, retry once smoothly
      if (
        popupErr?.message?.includes('Database is closing') ||
        popupErr?.message?.includes('closing/hidden') ||
        popupErr?.code === 'auth/internal-error'
      ) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        result = await signInWithPopup(auth, provider);
      } else {
        throw popupErr;
      }
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google OAuth Access Token.');
    }
    accessToken = credential.accessToken;
    cachedAccessToken = accessToken;
  }

  // 1. Create a blank Google Document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'LankaEcon Enterprise Automated Accounting System Report',
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json();
    throw new Error(`Google Docs API Error (${createRes.status}): ${errData.error?.message || 'Failed to create document'}`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. Populate text into the created Google Document
  const batchRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: reportContentText,
          },
        },
      ],
    }),
  });

  if (!batchRes.ok) {
    console.warn('Batch update warned:', await batchRes.text());
  }

  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
  return { documentId, documentUrl };
};
