import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyABSI_m5vpEGXaCo4ObL3d0O8BQ11XNrEE',
  authDomain: 'nkg-reisen-mitarbeiterportal.firebaseapp.com',
  projectId: 'nkg-reisen-mitarbeiterportal',
  storageBucket: 'nkg-reisen-mitarbeiterportal.firebasestorage.app',
  messagingSenderId: '1451635072',
  appId: '1:1451635072:web:6e75a21ce9031710951165',
  measurementId: 'G-3NWZXVEQ48'
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const analytics = isSupported()
  .then((supported) => (supported ? getAnalytics(app) : null))
  .catch(() => null)
