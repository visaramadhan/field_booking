import { registerUser, loginUser } from '../src/services/authService.js';

const email = 'ivandaniar677@gmail.com';
const password = 'password';

(async () => {
  const res = await registerUser({
    fullName: 'Administrator',
    email,
    password,
    phoneNumber: '',
    accountType: 'admin'
  });

  if (!res?.success) {
    console.error('Gagal membuat akun admin:', res?.error);
    process.exit(1);
  }

  const loginRes = await loginUser(email, password);
  if (!loginRes?.success) {
    console.error('Akun dibuat, tapi gagal login:', loginRes?.error);
    process.exit(1);
  }

  console.log('Akun admin berhasil dibuat:', {
    uid: loginRes?.user?.uid,
    email: loginRes?.user?.email,
    role: loginRes?.user?.userData?.accountType
  });
})();