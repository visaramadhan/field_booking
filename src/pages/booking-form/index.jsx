import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import AuthenticationGuard from '../../components/navigation/AuthenticationGuard';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import BookingFormHeader from './component/BookingFormHeader';
import BookingDetailsForm from './component/BookingDetailsForm';
import BookingPolicySection from './component/BookingPolicySection';
import BookingActions from './component/BookingActions';
import { createBooking } from '../../services/bookingService';
import { auth } from '../../config/firebase';

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
      const bookingPayload = {
        userId: auth?.currentUser?.uid || localStorage.getItem('userId') || `guest-${Date.now()}`,
        userName: localStorage.getItem('userName') || 'Pengguna',
        fieldId: fieldData?.id,
        fieldName: fieldData?.name,
        date: formData?.bookingDate,
        startTime: formData?.startTime,
        duration: parseInt(formData?.duration),
        purpose: formData?.purpose,
        phoneNumber: formData?.phoneNumber,
        specialRequests: formData?.specialRequirements,
        totalPrice: fieldData?.pricePerHour * parseInt(formData?.duration || 0) + 5000,
        status: 'pending'
      };
      const result = await createBooking(bookingPayload);
      if (result?.success) {
        const bookingId = result?.bookingId;
        window.showNotification({
          type: 'success',
          message: 'Booking berhasil dibuat'
        });
        navigate('/payment-management', {
          state: {
            bookingData: {
              bookingId,
              fieldName: bookingPayload?.fieldName,
              date: bookingPayload?.date,
              time: `${bookingPayload?.startTime}`,
              duration: bookingPayload?.duration,
              totalAmount: bookingPayload?.totalPrice
            }
          }
        });
      } else {
        window.showNotification({
          type: 'error',
          message: result?.error || 'Gagal membuat booking'
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      window.showNotification({
        type: 'error',
        message: error?.message || 'Terjadi kesalahan saat memproses booking'
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
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center space-x-4">
                    <img src={fieldData?.image} alt={fieldData?.imageAlt} className="w-20 h-20 rounded-lg object-cover" onError={(e)=>{e.target.src='/assets/images/no_image.png'}} />
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-foreground">{fieldData?.name}</div>
                      <div className="text-sm text-muted-foreground">Harga per jam: Rp {fieldData?.pricePerHour?.toLocaleString('id-ID')}</div>
                      <div className="text-xs text-muted-foreground">Lokasi: {fieldData?.location}</div>
                    </div>
                  </div>
                </div>
                <BookingDetailsForm
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange} />

                <BookingPolicySection />
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lapangan</span>
                      <span className="text-sm font-medium text-foreground">{fieldData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tanggal</span>
                      <span className="text-sm font-medium text-foreground">{formData?.bookingDate || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Waktu</span>
                      <span className="text-sm font-medium text-foreground">{formData?.startTime || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Durasi</span>
                      <span className="text-sm font-medium text-foreground">{formData?.duration || 0} jam</span>
                    </div>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-foreground">Total</span>
                        <span className="text-base font-bold text-primary">Rp {(fieldData?.pricePerHour * parseInt(formData?.duration || 0) + 5000)?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

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