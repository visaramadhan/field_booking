import { collection, doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const createScheduleSlot = async (slot) => {
  try {
    const id = slot?.id || `SC-${Date.now()}-${Math.random()?.toString(36)?.substr(2,9)}`;
    const ref = doc(db, 'schedules', id);
    await setDoc(ref, {
      ...slot,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const listenSchedules = (callback) => {
  const col = collection(db, 'schedules');
  return onSnapshot(col, (snap) => {
    const items = snap?.docs?.map(d => ({ id: d?.id, ...d?.data() }));
    callback(items);
  });
};