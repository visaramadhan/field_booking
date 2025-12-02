import { 
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const createBooking = async (bookingData) => {
  try {
    const bookingId = bookingData?.bookingId || `BK-${Date.now()}-${Math.random()?.toString(36)?.substr(2,9)}`;
    const ref = doc(db, 'bookings', bookingId);
    await setDoc(ref, {
      ...bookingData,
      bookingId,
      status: bookingData?.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, bookingId };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const listenBookings = (callback) => {
  const col = collection(db, 'bookings');
  return onSnapshot(col, (snapshot) => {
    const items = snapshot?.docs?.map((d) => ({ id: d?.id, ...d?.data() }));
    callback(items);
  });
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const ref = doc(db, 'bookings', bookingId);
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const removeBooking = async (bookingId) => {
  try {
    const ref = doc(db, 'bookings', bookingId);
    await deleteDoc(ref);
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const items = snap?.docs?.map(d=>({ id: d?.id, ...d?.data() }));
    return { success: true, bookings: items };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};