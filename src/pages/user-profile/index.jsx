import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getUserBookings } from '../../services/bookingService';
import ProfileHeader from './component/ProfileHeader';
import ProfileForm from './component/ProfileForm';
import PasswordChangeForm from './component/PasswordChangeForm';
import AccountStatistics from './component/AccountStatistic';
import SecuritySettings from './component/SecuritySettings';
import PrivacyInformation from './component/PrivacyInformation';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({ fullName:'', email:'', phoneNumber:'', address:'' });

  const [errors, setErrors] = useState({});

  const [statistics, setStatistics] = useState({ totalBookings: 0, activeBookings: 0, completedBookings: 0, cancelledBookings: 0 });

  const [securitySettings, setSecuritySettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    promotionalEmails: false
  });

  useEffect(() => {
    const load = async () => {
      const current = auth?.currentUser;
      if (!current?.uid) {
        navigate('/authentication');
        return;
      }
      const snap = await getDoc(doc(db, 'users', current.uid));
      const data = snap?.data() || {};
      const role = data?.accountType || 'customer';
      if (role === 'admin') {
        navigate('/admin-booking-management');
        return;
      }
      setUserData({
        fullName: data?.fullName || '',
        email: data?.email || current?.email || '',
        phoneNumber: data?.phoneNumber || '',
        address: data?.address || '',
        profileImage: data?.photoURL || '',
        profileImageAlt: data?.profileImageAlt || 'User profile image'
      });
      setFormData({
        fullName: data?.fullName || '',
        email: data?.email || current?.email || '',
        phoneNumber: data?.phoneNumber || '',
        address: data?.address || ''
      });
      const bookingsRes = await getUserBookings(current.uid);
      if (bookingsRes?.success) {
        const bookings = bookingsRes?.bookings || [];
        setStatistics({
          totalBookings: bookings?.length,
          activeBookings: bookings?.filter(b=> b?.status === 'pending' || b?.status === 'confirmed')?.length,
          completedBookings: bookings?.filter(b=> b?.status === 'completed')?.length,
          cancelledBookings: bookings?.filter(b=> b?.status === 'cancelled' || b?.status === 'rejected')?.length
        });
      }
    };
    load();
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex?.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    } else if (formData?.fullName?.trim()?.length < 3) {
      newErrors.fullName = 'Nama minimal 3 karakter';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData?.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    } else if (!validatePhoneNumber(formData?.phoneNumber)) {
      newErrors.phoneNumber = 'Format nomor telepon tidak valid (contoh: 081234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProfileSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      window.showNotification({
        type: 'error',
        message: 'Mohon periksa kembali data yang Anda masukkan'
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setUserData((prev) => ({
        ...prev,
        fullName: formData?.fullName,
        email: formData?.email,
        phoneNumber: formData?.phoneNumber,
        address: formData?.address
      }));

      setIsLoading(false);
      window.showNotification({
        type: 'success',
        message: 'Profil berhasil diperbarui'
      });
    }, 1500);
  };

  const handlePasswordChange = (passwordData) => {
    setIsPasswordLoading(true);

    setTimeout(() => {
      setIsPasswordLoading(false);
      window.showNotification({
        type: 'success',
        message: 'Password berhasil diubah. Silakan login kembali dengan password baru'
      });
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes?.includes(file?.type)) {
      window.showNotification({
        type: 'error',
        message: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP'
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file?.size > maxSize) {
      window.showNotification({
        type: 'error',
        message: 'Ukuran file maksimal 5MB'
      });
      return;
    }

    setIsImageUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setUserData((prev) => ({
          ...prev,
          profileImage: reader?.result,
          profileImageAlt: 'Updated profile photo of user with new image'
        }));
        setIsImageUploading(false);
        window.showNotification({
          type: 'success',
          message: 'Foto profil berhasil diperbarui'
        });
      }, 1000);
    };
    reader?.readAsDataURL(file);
  };

  const handleSettingChange = (settingId, value) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [settingId]: value
    }));

    window.showNotification({
      type: 'success',
      message: 'Pengaturan berhasil diperbarui'
    });
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan dan semua data Anda akan dihapus permanen.'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        'Konfirmasi terakhir: Semua booking, riwayat, dan data pribadi akan dihapus. Lanjutkan?'
      );

      if (doubleConfirm) {
        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          window.showNotification({
            type: 'success',
            message: 'Akun berhasil dihapus'
          });
          navigate('/authentication');
        }, 1000);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    window.showNotification({
      type: 'success',
      message: 'Berhasil keluar dari akun'
    });
    navigate('/authentication');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        userRole="customer"
        userName={userData?.fullName}
        onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-24 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {userData && (
            <ProfileHeader
              userName={userData?.fullName}
              userEmail={userData?.email}
              profileImage={userData?.profileImage}
              profileImageAlt={userData?.profileImageAlt}
              onImageUpload={handleImageUpload}
              isUploading={isImageUploading} />
          )}


          <AccountStatistics statistics={statistics} />

          <ProfileForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
            onSubmit={handleProfileSubmit}
            isLoading={isLoading} />


          <PasswordChangeForm
            onSubmit={handlePasswordChange}
            isLoading={isPasswordLoading} />


          <SecuritySettings
            settings={securitySettings}
            onSettingChange={handleSettingChange} />


          <PrivacyInformation onDeleteAccount={handleDeleteAccount} />
        </div>
      </main>
      <BottomNavigation userRole="customer" />
    </div>);

};

export default UserProfile;