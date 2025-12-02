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
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { listenBookings, updateBookingStatus, removeBooking, createBooking } from '../../services/bookingService';
import { getBankDetails, saveBankDetails } from '../../services/settingsService';
import { createPayment, uploadPaymentProof, updatePaymentStatus } from '../../services/paymentService';
import { auth } from '../../config/firebase';

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

  const [bookings, setBookings] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    fieldName: '',
    date: '',
    startTime: '',
    duration: '1',
    totalPrice: ''
  });

  const revenueData = {
    total: 2500000,
    paid: 1800000,
    pending: 700000,
    thisMonth: 2500000,
    lastMonth: 2100000
  };

  const [bankDetails, setBankDetails] = useState({ bankName:'', accountNumber:'', accountName:'', branch:'' });
  const [paymentForm, setPaymentForm] = useState({ bookingId:'', amount:'', file:null, paymentId:null, status:'' });
  const [isUploadingProof, setIsUploadingProof] = useState(false);

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
    const unsub = listenBookings((items) => {
      setBookings(items || []);
    });
    (async () => {
      const res = await getBankDetails();
      if (res?.success && res?.data) {
        setBankDetails(res?.data);
      }
    })();
    return () => {
      if (unsub) unsub();
    };
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
        await updateBookingStatus(bookingId, 'confirmed');
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
        await updateBookingStatus(bookingId, 'rejected');
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
        await removeBooking(bookingId);
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
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Buat Booking Langsung
                </Button>
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                >
                  Ekspor Data
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Kelola semua reservasi lapangan dan persetujuan booking
            </p>
          </div>

          <RevenueTracker revenueData={revenueData} />

          <div className="mt-6 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Building" size={20} color="var(--color-primary)" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Pengaturan Rekening untuk Transfer</h2>
              </div>
              <Button
                variant="success"
                iconName="Save"
                iconPosition="left"
                onClick={async ()=>{
                  const res = await saveBankDetails(bankDetails);
                  if (res?.success) {
                    window.showNotification && window.showNotification({ type:'success', message:'Informasi rekening tersimpan' });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal menyimpan' });
                  }
                }}
              >
                Simpan
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Bank" value={bankDetails?.bankName} onChange={(e)=>setBankDetails({...bankDetails, bankName:e?.target?.value})} />
              <Input label="Nomor Rekening" value={bankDetails?.accountNumber} onChange={(e)=>setBankDetails({...bankDetails, accountNumber:e?.target?.value})} />
              <Input label="Atas Nama" value={bankDetails?.accountName} onChange={(e)=>setBankDetails({...bankDetails, accountName:e?.target?.value})} />
              <Input label="Cabang" value={bankDetails?.branch} onChange={(e)=>setBankDetails({...bankDetails, branch:e?.target?.value})} />
            </div>
          </div>

          <div className="mt-6 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="CreditCard" size={20} color="var(--color-primary)" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Kelola Pembayaran Manual</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Pilih Booking</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  value={paymentForm?.bookingId}
                  onChange={(e)=>{
                    const id = e?.target?.value;
                    const bk = bookings?.find(b=> (b?.bookingId || b?.id) === id);
                    setPaymentForm(prev=>({
                      ...prev,
                      bookingId:id,
                      amount: bk?.totalPrice || prev?.amount || ''
                    }));
                  }}
                >
                  <option value="">-- pilih booking --</option>
                  {bookings?.map((b)=>{
                    const id = b?.bookingId || b?.id;
                    return (
                      <option key={id} value={id}>{id} - {b?.userName} - {b?.fieldName}</option>
                    );
                  })}
                </select>
              </div>
              <Input label="Jumlah (Rp)" type="number" value={paymentForm?.amount} onChange={(e)=>setPaymentForm(prev=>({...prev, amount:e?.target?.value}))} />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-foreground mb-2">Upload Bukti (opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e)=>setPaymentForm(prev=>({...prev, file: e?.target?.files?.[0] || null}))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                variant="default"
                iconName="Receipt"
                iconPosition="left"
                onClick={async ()=>{
                  if (!paymentForm?.bookingId) {
                    window.showNotification && window.showNotification({ type:'error', message:'Pilih booking terlebih dahulu' });
                    return;
                  }
                  const res = await createPayment({
                    bookingId: paymentForm?.bookingId,
                    userId: 'admin-action',
                    totalAmount: parseInt(paymentForm?.amount || '0'),
                    paymentMethod: 'transfer',
                    currency: 'IDR',
                    source: 'admin_manual'
                  });
                  if (res?.success) {
                    setPaymentForm(prev=>({...prev, paymentId: res?.paymentId }));
                    window.showNotification && window.showNotification({ type:'success', message:`Pembayaran dibuat: ${res?.paymentId}` });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal membuat pembayaran' });
                  }
                }}
              >
                Buat Pembayaran
              </Button>
              <Button
                variant="warning"
                iconName="Upload"
                iconPosition="left"
                loading={isUploadingProof}
                onClick={async ()=>{
                  if (!paymentForm?.paymentId || !paymentForm?.file) {
                    window.showNotification && window.showNotification({ type:'error', message:'Buat pembayaran dan pilih bukti dulu' });
                    return;
                  }
                  setIsUploadingProof(true);
                  const r = await uploadPaymentProof(paymentForm?.paymentId, paymentForm?.file);
                  setIsUploadingProof(false);
                  if (r?.success) {
                    window.showNotification && window.showNotification({ type:'success', message:'Bukti terupload' });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: r?.error || 'Gagal upload bukti' });
                  }
                }}
              >
                Upload Bukti
              </Button>
              <Button
                variant="success"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={async ()=>{
                  if (!paymentForm?.paymentId) {
                    window.showNotification && window.showNotification({ type:'error', message:'Tidak ada paymentId' });
                    return;
                  }
                  const r = await updatePaymentStatus(paymentForm?.paymentId, 'approved');
                  if (r?.success) {
                    window.showNotification && window.showNotification({ type:'success', message:'Pembayaran disetujui' });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: r?.error || 'Gagal menyetujui pembayaran' });
                  }
                }}
              >
                Setujui Pembayaran
              </Button>
            </div>
          </div>

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
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Buat Booking Langsung</h3>
                <Button variant="ghost" iconName="X" onClick={() => setIsCreateModalOpen(false)} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Input label="Nama Customer" name="userName" value={createForm?.userName} onChange={(e)=>setCreateForm({...createForm, userName:e?.target?.value})} />
                <Input label="No. Telepon" name="userPhone" value={createForm?.userPhone} onChange={(e)=>setCreateForm({...createForm, userPhone:e?.target?.value})} />
                <Input label="Email" name="userEmail" value={createForm?.userEmail} onChange={(e)=>setCreateForm({...createForm, userEmail:e?.target?.value})} />
                <Input label="Nama Lapangan" name="fieldName" value={createForm?.fieldName} onChange={(e)=>setCreateForm({...createForm, fieldName:e?.target?.value})} />
                <Input label="Tanggal" type="date" name="date" value={createForm?.date} onChange={(e)=>setCreateForm({...createForm, date:e?.target?.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Waktu Mulai" type="time" name="startTime" value={createForm?.startTime} onChange={(e)=>setCreateForm({...createForm, startTime:e?.target?.value})} />
                  <Select label="Durasi" value={createForm?.duration} onChange={(v)=>setCreateForm({...createForm, duration:v})} options={[
                    { value: '1', label: '1 jam' },
                    { value: '2', label: '2 jam' },
                    { value: '3', label: '3 jam' }
                  ]} />
                </div>
                <Input label="Total Harga" type="number" name="totalPrice" value={createForm?.totalPrice} onChange={(e)=>setCreateForm({...createForm, totalPrice:e?.target?.value})} />
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                <Button
                  variant="success"
                  iconName="Check"
                  onClick={async ()=>{
                    const payload = {
                      userId: auth?.currentUser?.uid || 'admin',
                      userName: createForm?.userName,
                      userPhone: createForm?.userPhone,
                      userEmail: createForm?.userEmail,
                      fieldName: createForm?.fieldName,
                      date: createForm?.date,
                      startTime: createForm?.startTime,
                      duration: parseInt(createForm?.duration || '1'),
                      totalPrice: parseInt(createForm?.totalPrice || '0'),
                      status: 'confirmed',
                      source: 'admin_direct'
                    };
                    const res = await createBooking(payload);
                    if (res?.success) {
                      window.showNotification && window.showNotification({ type:'success', message:'Booking langsung berhasil dibuat' });
                      setIsCreateModalOpen(false);
                      setCreateForm({ userName:'', userPhone:'', userEmail:'', fieldName:'', date:'', startTime:'', duration:'1', totalPrice:'' });
                    } else {
                      window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal membuat booking' });
                    }
                  }}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticationGuard>
  );
};

export default AdminBookingManagement;