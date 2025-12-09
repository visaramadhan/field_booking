import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

const FIELDS_COL = 'fields';

export const listenFields = (callback) => {
  const col = collection(db, FIELDS_COL);
  return onSnapshot(col, (snapshot) => {
    const items = snapshot?.docs?.map((d) => ({ id: d?.id, ...d?.data() }));
    callback(items);
  });
};

export const createField = async (fieldData) => {
  try {
    const id = fieldData?.id?.toString() || `FLD-${Date.now()}-${Math.random()?.toString(36)?.substr(2,9)}`;
    const ref = doc(db, FIELDS_COL, id);
    await setDoc(ref, {
      ...fieldData,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const updateField = async (id, fieldData) => {
  try {
    const ref = doc(db, FIELDS_COL, id);
    await updateDoc(ref, { ...fieldData, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const deleteField = async (id) => {
  try {
    const ref = doc(db, FIELDS_COL, id);
    await deleteDoc(ref);
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const getFieldById = async (id) => {
  try {
    const ref = doc(db, FIELDS_COL, id);
    const snap = await getDoc(ref);
    return { success: true, field: snap?.data() };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};
