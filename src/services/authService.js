import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase.js';

export const registerUser = async (userData) => {
  try {
    // Create authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData?.email, 
      userData?.password
    );
    
    const user = userCredential?.user;
    
    // Upload profile picture if provided
    let photoURL = null;
    if (userData?.profilePicture) {
      const storageRef = ref(storage, `profile-pictures/${user?.uid}`);
      await uploadBytes(storageRef, userData?.profilePicture);
      photoURL = await getDownloadURL(storageRef);
    }
    
    // Update profile
    await updateProfile(user, {
      displayName: userData?.fullName,
      photoURL: photoURL
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user?.uid), {
      fullName: userData?.fullName,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
      accountType: userData?.accountType || 'customer',
      photoURL: photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      user: {
        uid: user?.uid,
        email: user?.email,
        displayName: userData?.fullName,
        photoURL: photoURL
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential?.user?.uid));
    
    return {
      success: true,
      user: {
        ...userCredential?.user,
        userData: userDoc?.data()
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error?.message
    };
  }
};