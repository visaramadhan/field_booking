import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import ScheduleCalendar from './component/ScheduleCalendar';
import FieldFilterPanel from './component/FieldFilterPanel';
import FieldDetailCard from './component/FieldDetailCard';
import BookingModal from './component/BookingModal';
import FieldListView from './component/FieldListView';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { listenFields } from '../../services/fieldService';
import { listenBookings, createBooking } from '../../services/bookingService';
import { listenSchedules } from '../../services/scheduleService';
import { auth } from '../../config/firebase';

const FieldSchedule = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedField, setSelectedField] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('customer');

  const [filters, setFilters] = useState({
    searchQuery: '',
    fieldType: 'all',
    priceRange: 'all',
    timeSlot: 'all'
  });

  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);


  const mockBookings = [
  {
    id: 1,
    fieldId: 1,
    date: "21/11/2025",
    time: "08:00",
    status: "confirmed",
    userName: "Ahmad Rizki"
  },
  {
    id: 2,
    fieldId: 1,
    date: "21/11/2025",
    time: "10:00",
    status: "pending",
    userName: "Budi Santoso"
  },
  {
    id: 3,
    fieldId: 2,
    date: "21/11/2025",
    time: "14:00",
    status: "confirmed",
    userName: "Citra Dewi"
  },
  {
    id: 4,
    fieldId: 3,
    date: "22/11/2025",
    time: "09:00",
    status: "confirmed",
    userName: "Dedi Kurniawan"
  }];


  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'Pengguna';
    const storedUserRole = localStorage.getItem('userRole') || 'customer';
    setUserName(storedUserName);
    setUserRole(storedUserRole);
    const unsubFields = listenFields((items)=> setFields(items || []));
    const unsubBookings = listenBookings((items)=> setBookings(items || []));
    const unsubSchedules = listenSchedules((items)=> setSchedules(items || []));
    return ()=>{ if (unsubFields) unsubFields(); if (unsubBookings) unsubBookings(); if (unsubSchedules) unsubSchedules(); };
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      fieldType: 'all',
      priceRange: 'all',
      timeSlot: 'all'
    });
  };

  const getFilteredFields = () => {
    let filtered = [...fields];

    if (filters?.searchQuery) {
      filtered = filtered?.filter((field) =>
      field?.name?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) ||
      field?.description?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase())
      );
    }

    if (filters?.fieldType !== 'all') {
      filtered = filtered?.filter((field) => field?.type === filters?.fieldType);
    }

    if (filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.split('-')?.map((v) => v?.replace('+', ''));
      filtered = filtered?.filter((field) => {
        if (max) {
          return field?.price >= parseInt(min) && field?.price <= parseInt(max);
        } else {
          return field?.price >= parseInt(min);
        }
      });
    }

    return filtered;
  };

  const handleViewDetails = (field) => {
    setSelectedField(field);
    setShowDetailModal(true);
  };

  const handleBookSlot = (field, date, time) => {
    setSelectedField(field);
    setBookingSlot({ date, time });
    setShowBookingModal(true);
  };

  const handleBookField = (field) => {
    setSelectedField(field);
    const today = new Date();
    setBookingSlot({ date: today, time: '08:00' });
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingData) => {
    console.log('Booking confirmed:', bookingData);

    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        message: 'Booking berhasil dibuat! Menunggu persetujuan admin.',
        duration: 5000
      });
    }

    setShowBookingModal(false);
    setSelectedField(null);
    setBookingSlot(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/authentication');
  };

  const filteredFields = getFilteredFields();
  const transformedBookings = bookings?.map(b=>{
    try {
      const d = new Date(b?.date);
      const day = String(d?.getDate())?.padStart(2,'0');
      const month = String(d?.getMonth()+1)?.padStart(2,'0');
      const year = d?.getFullYear();
      return { fieldId: b?.fieldId, date: `${day}/${month}/${year}`, time: b?.startTime, status: b?.status };
    } catch(_) {
      return { fieldId: b?.fieldId, date: b?.date, time: b?.startTime, status: b?.status };
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout} />

      <NotificationSystem />
      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Jadwal Lapangan</h1>
              <p className="text-muted-foreground">
                Lihat ketersediaan lapangan dan buat booking dengan mudah
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => setViewMode('calendar')}>

                Kalender
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                iconName="Grid"
                iconPosition="left"
                onClick={() => setViewMode('list')}>

                Daftar
              </Button>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              fullWidth
              iconName="Calendar"
              iconPosition="left"
              onClick={() => setViewMode('calendar')}>

              Kalender
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              fullWidth
              iconName="Grid"
              iconPosition="left"
              onClick={() => setViewMode('list')}>

              Daftar
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <FieldFilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters} />


        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredFields?.length} dari {fields?.length} lapangan
          </p>
        </div>

        {/* Content Area */}
        {viewMode === 'calendar' ?
        <ScheduleCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          fields={filteredFields}
          bookings={transformedBookings}
          schedules={schedules}
          onBookSlot={handleBookSlot} /> :


        <FieldListView
          fields={filteredFields}
          onViewDetails={handleViewDetails}
          onBookField={handleBookField} />

        }

        {/* Empty State */}
        {filteredFields?.length === 0 &&
        <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada lapangan ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah filter pencarian Anda
            </p>
            <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleResetFilters}>

              Reset Filter
            </Button>
          </div>
        }
      </main>
      {/* Modals */}
      {showDetailModal && selectedField &&
      <FieldDetailCard
        field={selectedField}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedField(null);
        }}
        onBookNow={(field) => {
          setShowDetailModal(false);
          handleBookField(field);
        }} />

      }
      {showBookingModal && selectedField && bookingSlot &&
      <BookingModal
        field={selectedField}
        selectedDate={bookingSlot?.date}
        selectedTime={bookingSlot?.time}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedField(null);
          setBookingSlot(null);
        }}
        onConfirm={async (data)=>{
          const userId = auth?.currentUser?.uid || 'anonymous';
          const payload = {
            userId,
            userName,
            userEmail: auth?.currentUser?.email || '',
            fieldId: selectedField?.id,
            fieldName: selectedField?.name,
            date: data?.date,
            startTime: data?.startTime || data?.time,
            duration: data?.duration || 1,
            totalPrice: data?.total || Number(selectedField?.pricePerHour || selectedField?.price || 0) * Number(data?.duration || 1),
            status: 'pending',
            source: 'user_booking'
          };
          const res = await createBooking(payload);
          if (res?.success) {
            window.showNotification && window.showNotification({ type:'success', message:'Booking berhasil dibuat! Menunggu persetujuan admin.' });
          } else {
            window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal membuat booking' });
          }
          setShowBookingModal(false);
          setSelectedField(null);
          setBookingSlot(null);
        }} />
      
      }
      <BottomNavigation userRole={userRole} />
    </div>);

};

export default FieldSchedule;
