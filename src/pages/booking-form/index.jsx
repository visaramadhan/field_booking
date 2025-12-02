import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import AuthenticationGuard from '../../components/navigation/AuthenticationGuard';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import BookingFormHeader from './components/BookingFormHeader';
import FieldInfoCard from './components/FieldInfoCard';
import BookingDetailsForm from './components/BookingDetailsForm';
import BookingSummaryPanel from './components/BookingSummaryPanel';
import BookingPolicySection from './components/BookingPolicySection';
import BookingActions from './components/BookingActions';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('customer');

  const fieldData = location?.state?.fieldData || {
    id: 'field-001',
    name: 'Lapangan Futsal A',
    image: "https://images.unsplash.com/photo-1660848942601-4b7216b8a653",
    imageAlt: 'Modern indoor futsal field with green artificial turf, white boundary lines, and professional lighting system mounted on ceiling',
    location: 'Jl. Sudirman No. 123, Jakarta Pusat',
    capacity: '10-12 pemain',
    facilities: 'Ruang ganti, Toilet, Kantin, Parkir luas',
    pricePerHour: 150000
  };

  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    duration: '',
    purpose: '',
    phoneNumber: '',
    specialRequirements: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'User';
    const storedUserRole = localStorage.getItem('userRole') || 'customer';
    setUserName(storedUserName);
    setUserRole(storedUserRole);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.bookingDate) {
      newErrors.bookingDate = 'Tanggal booking wajib diisi';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.bookingDate = 'Tanggal booking tidak boleh di masa lalu';
      }
    }

    if (!formData?.startTime) {
      newErrors.startTime = 'Waktu mulai wajib diisi';
    } else {
      const [hours] = formData?.startTime?.split(':');
      const hour = parseInt(hours);
      if (hour < 6 || hour >= 23) {
        newErrors.startTime = 'Waktu operasional: 06:00 - 23:00 WIB';
      }
    }

    if (!formData?.duration) {
      newErrors.duration = 'Durasi booking wajib dipilih';
    }

    if (!formData?.purpose) {
      newErrors.purpose = 'Tujuan booking wajib dipilih';
    }

    if (!formData?.phoneNumber) {
      newErrors.phoneNumber = 'Nomor telepon wajib diisi';
    } else if (!/^[0-9]{10,13}$/?.test(formData?.phoneNumber)) {
      newErrors.phoneNumber = 'Format nomor telepon tidak valid (10-13 digit)';
    }

    if (formData?.specialRequirements && formData?.specialRequirements?.length > 500) {
      newErrors.specialRequirements = 'Catatan maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      window.showNotification({
        type: 'error',
        message: 'Mohon lengkapi semua field yang wajib diisi'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const bookingReference = `BK${Date.now()?.toString()?.slice(-8)}`;

      const bookingData = {
        bookingReference,
        fieldId: fieldData?.id,
        fieldName: fieldData?.name,
        ...formData,
        status: 'pending',
        totalPrice: fieldData?.pricePerHour * parseInt(formData?.duration) + 5000,
        createdAt: new Date()?.toISOString(),
        userId: localStorage.getItem('userId') || 'user-001'
      };

      localStorage.setItem(`booking_${bookingReference}`, JSON.stringify(bookingData));

      window.showNotification({
        type: 'success',
        message: `Booking berhasil! Referensi: ${bookingReference}`
      });

      setTimeout(() => {
        navigate('/field-schedule', {
          state: {
            bookingSuccess: true,
            bookingReference
          }
        });
      }, 1500);

    } catch (error) {
      console.error('Booking submission error:', error);
      window.showNotification({
        type: 'error',
        message: 'Terjadi kesalahan saat memproses booking. Silakan coba lagi.'
      });
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/field-schedule');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/authentication');
  };

  const isFormValid = formData?.bookingDate &&
  formData?.startTime &&
  formData?.duration &&
  formData?.purpose &&
  formData?.phoneNumber &&
  Object.keys(errors)?.length === 0;

  return (
    <AuthenticationGuard requiredRole="customer">
      <div className="min-h-screen bg-background">
        <NavigationHeader
          userRole={userRole}
          userName={userName}
          onLogout={handleLogout} />

        <NotificationSystem />

        <div className="pt-16 pb-20 md:pb-8">
          <BookingFormHeader onBack={handleBack} />

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <FieldInfoCard fieldData={fieldData} />
                <BookingDetailsForm
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange} />

                <BookingPolicySection />
              </div>

              <div className="lg:col-span-1">
                <BookingSummaryPanel
                  fieldData={fieldData}
                  formData={formData}
                  totalPrice={fieldData?.pricePerHour * parseInt(formData?.duration || 0) + 5000} />

              </div>
            </div>

            <div className="mt-8">
              <BookingActions
                onSubmit={handleSubmit}
                onCancel={handleBack}
                isSubmitting={isSubmitting}
                isFormValid={isFormValid} />

            </div>
          </div>
        </div>

        <BottomNavigation userRole={userRole} />
      </div>
    </AuthenticationGuard>);

};

export default BookingForm;