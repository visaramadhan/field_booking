import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const paymentsDoc = doc(db, 'settings', 'payments');
const businessDoc = doc(db, 'settings', 'business');

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

export const getBusinessSettings = async () => {
  try {
    const snap = await getDoc(businessDoc);
    if (snap?.exists()) {
      return { success: true, data: snap?.data() };
    }
    return {
      success: true,
      data: {
        weekdayHours: { start: '08:00', end: '22:00' },
        weekendHours: { start: '06:00', end: '24:00' },
        holidays: []
      }
    };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};

export const saveBusinessSettings = async (settings) => {
  try {
    await setDoc(businessDoc, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message };
  }
};
