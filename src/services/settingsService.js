import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const paymentsDoc = doc(db, 'settings', 'payments');

export const getBankDetails = async () => {
  try {
    const snap = await getDoc(paymentsDoc);
    if (snap?.exists()) {
      return { success: true, data: snap?.data()?.bankDetails };
    }
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const saveBankDetails = async (details) => {
  try {
    await setDoc(paymentsDoc, { bankDetails: details, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};