import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Create payment record
export const createPayment = async (paymentData) => {
  try {
    const paymentId = `PAY-${Date.now()}-${Math.random()?.toString(36)?.substr(2, 9)}`;
    const paymentRef = doc(db, 'payments', paymentId);
    
    await setDoc(paymentRef, {
      ...paymentData,
      paymentId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    if (paymentData?.bookingId) {
      try {
        await updateDoc(doc(db, 'bookings', paymentData?.bookingId), {
          paymentStatus: 'pending',
          updatedAt: serverTimestamp()
        });
      } catch (_) {}
    }
    
    return {
      success: true,
      paymentId
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

// Upload payment proof
export const uploadPaymentProof = async (paymentId, proofFile) => {
  try {
    const fileName = `${Date.now()}_${proofFile?.name || 'proof'}`;
    const storageRef = ref(storage, `payment-proofs/${paymentId}/${fileName}`);
    const metadata = { contentType: proofFile?.type || 'image/jpeg' };
    const snapshot = await uploadBytes(storageRef, proofFile, metadata);
    const proofURL = await getDownloadURL(snapshot?.ref);

    const paymentRef = doc(db, 'payments', paymentId);
    const currentSnap = await getDoc(paymentRef);
    const current = currentSnap?.data() || {};
    const nextStatus = current?.status === 'approved' ? 'approved' : 'verification_pending';

    await updateDoc(paymentRef, {
      proofURL,
      proofUploadedAt: serverTimestamp(),
      status: nextStatus,
      updatedAt: serverTimestamp()
    });
    try {
      const bookingId = current?.bookingId;
      if (bookingId) {
        await updateDoc(doc(db, 'bookings', bookingId), {
          paymentStatus: nextStatus === 'approved' ? 'paid' : 'verification_pending',
          updatedAt: serverTimestamp()
        });
      }
    } catch (_) {}

    return {
      success: true,
      proofURL
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

// Get payment by ID
export const getPayment = async (paymentId) => {
  try {
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    
    if (paymentDoc?.exists()) {
      return {
        success: true,
        payment: {
          id: paymentDoc?.id,
          ...paymentDoc?.data()
        }
      };
    } else {
      return {
        success: false,
        error: 'Payment not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

// Get payments by user
export const getUserPayments = async (userId) => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(paymentsQuery);
    const payments = querySnapshot?.docs?.map(doc => ({
      id: doc?.id,
      ...doc?.data()
    }));
    
    return {
      success: true,
      payments
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

export const getPaymentsByBooking = async (bookingId) => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('bookingId', '==', bookingId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(paymentsQuery);
    const payments = querySnapshot?.docs?.map(doc => ({ id: doc?.id, ...doc?.data() }));
    return { success: true, payments };
  } catch (error) {
    return { success: false, error: error?.message };
  }
};

// Update payment status (for admin)
export const updatePaymentStatus = async (paymentId, status, notes = '') => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    
    await updateDoc(paymentRef, {
      status,
      adminNotes: notes,
      verifiedAt: status === 'approved' ? serverTimestamp() : null,
      updatedAt: serverTimestamp()
    });
    try {
      const paySnap = await getDoc(paymentRef);
      const data = paySnap?.data();
      const bookingId = data?.bookingId;
      if (bookingId) {
        await updateDoc(doc(db, 'bookings', bookingId), {
          paymentStatus: status === 'approved' ? 'paid' : status,
          updatedAt: serverTimestamp()
        });
      }
      if (status === 'approved') {
        try {
          const existsQ = query(collection(db, 'financials'), where('paymentId', '==', paymentId));
          const existsSnap = await getDocs(existsQ);
          const alreadyRecorded = existsSnap && existsSnap?.docs && existsSnap?.docs?.length > 0;
          if (!alreadyRecorded) {
            const financeId = `FIN-${Date.now()}-${Math.random()?.toString(36)?.substr(2, 9)}`;
            const financeRef = doc(db, 'financials', financeId);
            await setDoc(financeRef, {
              financeId,
              paymentId,
              bookingId: data?.bookingId || null,
              userId: data?.userId || null,
              amount: data?.totalAmount || 0,
              method: data?.paymentMethod || 'unknown',
              source: data?.source || 'user',
              status: 'recorded',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
        } catch (_) {}
      }
    } catch (_) {}
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

export const listenPayments = (callback) => {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot?.docs?.map((d) => ({ id: d?.id, ...d?.data() }));
    callback(items);
  });
};


export const listenFinancials = (callback) => {
  const q = query(collection(db, 'financials'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot?.docs?.map((d) => ({ id: d?.id, ...d?.data() }));
    callback(items);
  });
};
