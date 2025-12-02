import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import AuthenticationGuard from '../../components/navigation/AuthenticationGuard';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BookingFilters from './components/BookingFilters';
import BookingTableRow from './components/BookingTableRow';
import MobileBookingCard from './components/MobileBookingCard';
import BulkActionsBar from './components/BulkActionsBar';
import RevenueTracker from './components/RevenueTracker';
import ConfirmationDialog from './components/ConfirmationDialog';

const AdminBookingManagement = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    action: null
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    field: 'all',
    dateFrom: '',
    dateTo: '',
    sort: 'date-desc'
  });

  const [bookings, setBookings] = useState([
    {
      id: 'BK-2025-001',
      userName: 'Ahmad Rizki',
      userEmail: 'ahmad.rizki@email.com',
      userPhone: '+62 812-3456-7890',
      fieldName: 'Lapangan Futsal A',
      date: '2025-11-25',
      startTime: '14:00',
      endTime: '16:00',
      duration: 2,
      totalPrice: 300000,
      status: 'pending',
      paymentStatus: 'unpaid',
      submittedAt: '21/11/2025 10:30',
      specialRequests: 'Mohon sediakan bola futsal dan rompi latihan untuk 10 orang',
      adminNotes: ''
    },
    {
      id: 'BK-2025-002',
      userName: 'Siti Nurhaliza',
      userEmail: 'siti.nurhaliza@email.com',
      userPhone: '+62 813-4567-8901',
      fieldName: 'Lapangan Basket Indoor',
      date: '2025-11-24',
      startTime: '16:00',
      endTime: '18:00',
      duration: 2,
      totalPrice: 400000,
      status: 'confirmed',
      paymentStatus: 'paid',
      submittedAt: '20/11/2025 14:20',
      specialRequests: 'Perlu pencahayaan ekstra untuk sesi latihan malam',
      adminNotes: 'Pembayaran sudah dikonfirmasi via transfer bank'
    },
    {
      id: 'BK-2025-003',
      userName: 'Budi Santoso',
      userEmail: 'budi.santoso@email.com',
      userPhone: '+62 814-5678-9012',
      fieldName: 'Lapangan Futsal B',
      date: '2025-11-26',
      startTime: '08:00',
      endTime: '10:00',
      duration: 2,
      totalPrice: 250000,
      status: 'pending',
      paymentStatus: 'unpaid',
      submittedAt: '21/11/2025 08:15',
      specialRequests: '',
      adminNotes: ''
    },
    {
      id: 'BK-2025-004',
      userName: 'Dewi Lestari',
      userEmail: 'dewi.lestari@email.com',
      userPhone: '+62 815-6789-0123',
      fieldName: 'Lapangan Voli Outdoor',
      date: '2025-11-23',
      startTime: '10:00',
      endTime: '12:00',
      duration: 2,
      totalPrice: 200000,
      status: 'completed',
      paymentStatus: 'paid',
      submittedAt: '18/11/2025 16:45',
      specialRequests: 'Mohon persiapkan net voli yang bagus',
      adminNotes: 'Booking selesai dengan baik, customer puas'
    },
    {
      id: 'BK-2025-005',
      userName: 'Eko Prasetyo',
      userEmail: 'eko.prasetyo@email.com',
      userPhone: '+62 816-7890-1234',
      fieldName: 'Lapangan Futsal A',
      date: '2025-11-27',
      startTime: '18:00',
      endTime: '20:00',
      duration: 2,
      totalPrice: 350000,
      status: 'rejected',
      paymentStatus: 'unpaid',
      submittedAt: '21/11/2025 12:00',
      specialRequests: 'Booking untuk turnamen internal perusahaan',
      adminNotes: 'Ditolak karena jadwal sudah penuh'
    },
    {
      id: 'BK-2025-006',
      userName: 'Fitri Handayani',
      userEmail: 'fitri.handayani@email.com',
      userPhone: '+62 817-8901-2345',
      fieldName: 'Lapangan Basket Indoor',
      date: '2025-11-28',
      startTime: '14:00',
      endTime: '17:00',
      duration: 3,
      totalPrice: 600000,
      status: 'confirmed',
      paymentStatus: 'paid',
      submittedAt: '19/11/2025 09:30',
      specialRequests: 'Perlu sound system untuk acara mini tournament',
      adminNotes: 'Sound system sudah diatur'
    },
    {
      id: 'BK-2025-007',
      userName: 'Gunawan Wijaya',
      userEmail: 'gunawan.wijaya@email.com',
      userPhone: '+62 818-9012-3456',
      fieldName: 'Lapangan Futsal B',
      date: '2025-11-29',
      startTime: '06:00',
      endTime: '08:00',
      duration: 2,
      totalPrice: 200000,
      status: 'pending',
      paymentStatus: 'unpaid',
      submittedAt: '21/11/2025 15:20',
      specialRequests: 'Booking pagi untuk latihan rutin tim',
      adminNotes: ''
    },
    {
      id: 'BK-2025-008',
      userName: 'Hendra Kusuma',
      userEmail: 'hendra.kusuma@email.com',
      userPhone: '+62 819-0123-4567',
      fieldName: 'Lapangan Voli Outdoor',
      date: '2025-11-30',
      startTime: '16:00',
      endTime: '18:00',
      duration: 2,
      totalPrice: 200000,
      status: 'cancelled',
      paymentStatus: 'unpaid',
      submittedAt: '20/11/2025 11:00',
      specialRequests: '',
      adminNotes: 'Dibatalkan oleh customer karena perubahan jadwal'
    }
  ]);

  const revenueData = {
    total: 2500000,
    paid: 1800000,
    pending: 700000,
    thisMonth: 2500000,
    lastMonth: 2100000
  };

  const bookingCounts = {
    total: bookings?.length,
    pending: bookings?.filter(b => b?.status === 'pending')?.length,
    confirmed: bookings?.filter(b => b?.status === 'confirmed')?.length,
    rejected: bookings?.filter(b => b?.status === 'rejected')?.length
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/authentication');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      field: 'all',
      dateFrom: '',
      dateTo: '',
      sort: 'date-desc'
    });
  };

  const handleToggleDetails = (bookingId) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  const showConfirmDialog = (type, title, message, action) => {
    setConfirmDialog({
      isOpen: true,
      type,
      title,
      message,
      action
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: 'warning',
      title: '',
      message: '',
      action: null
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog?.action) {
      setIsProcessing(true);
      await confirmDialog?.action();
      setIsProcessing(false);
      closeConfirmDialog();
    }
  };

  const handleApprove = (bookingId) => {
    showConfirmDialog(
      'success',
      'Setujui Booking',
      'Apakah Anda yakin ingin menyetujui booking ini? Pengguna akan menerima notifikasi konfirmasi.',
      async () => {
        setBookings(prev => prev?.map(b => 
          b?.id === bookingId ? { ...b, status: 'confirmed' } : b
        ));
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: 'Booking berhasil disetujui'
          });
        }
      }
    );
  };

  const handleReject = (bookingId) => {
    showConfirmDialog(
      'danger',
      'Tolak Booking',
      'Apakah Anda yakin ingin menolak booking ini? Pengguna akan menerima notifikasi penolakan.',
      async () => {
        setBookings(prev => prev?.map(b => 
          b?.id === bookingId ? { ...b, status: 'rejected' } : b
        ));
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: 'Booking telah ditolak'
          });
        }
      }
    );
  };

  const handleDelete = (bookingId) => {
    showConfirmDialog(
      'danger',
      'Hapus Booking',
      'Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak dapat dibatalkan.',
      async () => {
        setBookings(prev => prev?.filter(b => b?.id !== bookingId));
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: 'Booking berhasil dihapus'
          });
        }
      }
    );
  };

  const handleBulkApprove = () => {
    showConfirmDialog(
      'success',
      'Setujui Booking Terpilih',
      `Apakah Anda yakin ingin menyetujui ${selectedBookings?.length} booking yang dipilih?`,
      async () => {
        setBookings(prev => prev?.map(b => 
          selectedBookings?.includes(b?.id) ? { ...b, status: 'confirmed' } : b
        ));
        setSelectedBookings([]);
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `${selectedBookings?.length} booking berhasil disetujui`
          });
        }
      }
    );
  };

  const handleBulkReject = () => {
    showConfirmDialog(
      'danger',
      'Tolak Booking Terpilih',
      `Apakah Anda yakin ingin menolak ${selectedBookings?.length} booking yang dipilih?`,
      async () => {
        setBookings(prev => prev?.map(b => 
          selectedBookings?.includes(b?.id) ? { ...b, status: 'rejected' } : b
        ));
        setSelectedBookings([]);
        if (window.showNotification) {
          window.showNotification({
            type: 'error',
            message: `${selectedBookings?.length} booking telah ditolak`
          });
        }
      }
    );
  };

  const handleBulkDelete = () => {
    showConfirmDialog(
      'danger',
      'Hapus Booking Terpilih',
      `Apakah Anda yakin ingin menghapus ${selectedBookings?.length} booking yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        setBookings(prev => prev?.filter(b => !selectedBookings?.includes(b?.id)));
        setSelectedBookings([]);
        if (window.showNotification) {
          window.showNotification({
            type: 'success',
            message: `${selectedBookings?.length} booking berhasil dihapus`
          });
        }
      }
    );
  };

  const filteredBookings = bookings?.filter(booking => {
    if (filters?.search && !booking?.userName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && 
        !booking?.userEmail?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.status !== 'all' && booking?.status !== filters?.status) {
      return false;
    }
    if (filters?.field !== 'all' && booking?.fieldName !== filters?.field) {
      return false;
    }
    if (filters?.dateFrom && new Date(booking.date) < new Date(filters.dateFrom)) {
      return false;
    }
    if (filters?.dateTo && new Date(booking.date) > new Date(filters.dateTo)) {
      return false;
    }
    return true;
  });

  const sortedBookings = [...filteredBookings]?.sort((a, b) => {
    switch (filters?.sort) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'price-desc':
        return b?.totalPrice - a?.totalPrice;
      case 'price-asc':
        return a?.totalPrice - b?.totalPrice;
      case 'status':
        return a?.status?.localeCompare(b?.status);
      default:
        return 0;
    }
  });

  return (
    <AuthenticationGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <NavigationHeader 
          userRole="admin" 
          userName={userName} 
          onLogout={handleLogout} 
        />
        <NotificationSystem />

        <main className="container mx-auto px-4 pt-24 pb-24 md:pb-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="ClipboardList" size={28} color="var(--color-primary)" />
                </div>
                <span>Kelola Booking</span>
              </h1>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                className="hidden md:flex"
              >
                Ekspor Data
              </Button>
            </div>
            <p className="text-muted-foreground">
              Kelola semua reservasi lapangan dan persetujuan booking
            </p>
          </div>

          <RevenueTracker revenueData={revenueData} />

          <BookingFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            bookingCounts={bookingCounts}
          />

          <div className="hidden md:block mt-6 bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        aria-label="Pilih semua booking"
                      />
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Pengguna
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Lapangan
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Tanggal & Waktu
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Total Harga
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Diajukan
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBookings?.length > 0 ? (
                    sortedBookings?.map(booking => (
                      <BookingTableRow
                        key={booking?.id}
                        booking={booking}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDelete={handleDelete}
                        onToggleDetails={handleToggleDetails}
                        isExpanded={expandedBookingId === booking?.id}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
                          </div>
                          <p className="text-muted-foreground">Tidak ada booking yang ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden mt-6 space-y-4">
            {sortedBookings?.length > 0 ? (
              sortedBookings?.map(booking => (
                <MobileBookingCard
                  key={booking?.id}
                  booking={booking}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
                  </div>
                  <p className="text-muted-foreground">Tidak ada booking yang ditemukan</p>
                </div>
              </div>
            )}
          </div>
        </main>

        <BulkActionsBar
          selectedCount={selectedBookings?.length}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          onBulkDelete={handleBulkDelete}
          onDeselectAll={() => setSelectedBookings([])}
        />

        <ConfirmationDialog
          isOpen={confirmDialog?.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={handleConfirmAction}
          title={confirmDialog?.title}
          message={confirmDialog?.message}
          type={confirmDialog?.type}
          isProcessing={isProcessing}
        />

        <BottomNavigation userRole="admin" />
      </div>
    </AuthenticationGuard>
  );
};

export default AdminBookingManagement;