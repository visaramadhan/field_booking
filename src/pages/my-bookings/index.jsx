import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationGuard from '../../components/navigation/AuthenticationGuard';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { auth, db } from '../../config/firebase';
import { getUserBookings } from '../../services/bookingService';
import { createPayment, uploadPaymentProof, getPaymentsByBooking } from '../../services/paymentService';
import { storage } from '../../config/firebase';
import { ref as storageRef, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

const MyBookings = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Pengguna');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [proofFiles, setProofFiles] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({});
  const [proofURLs, setProofURLs] = useState({});

  useEffect(() => {
    const n = localStorage.getItem('userName') || 'Pengguna';
    setUserName(n);
  }, []);

  useEffect(() => {
    const load = async () => {
      const current = auth?.currentUser;
      if (!current?.uid) {
        navigate('/authentication');
        return;
      }
      setLoading(true);
      const res = await getUserBookings(current.uid);
      setLoading(false);
      if (res?.success) {
        const items = res?.bookings || [];
        setBookings(items?.sort((a,b)=> new Date(b?.date) - new Date(a?.date)));
      }
    };
    load();
  }, [navigate]);

  useEffect(()=>{
    (async ()=>{
      try {
        const next = {};
        for (const b of bookings || []) {
          const id = b?.bookingId || b?.id;
          if (!id) continue;
          const res = await getPaymentsByBooking(id);
          const p = res?.success ? (res?.payments?.[0] || null) : null;
          let url = p?.proofURL || null;
          if (url && !url?.includes('token=')) {
            try {
              const u = new URL(url);
              const nameParam = u?.searchParams?.get('name');
              const objectPath = nameParam ? decodeURIComponent(nameParam) : null;
              if (objectPath) {
                const fixed = await getStorageDownloadURL(storageRef(storage, objectPath));
                url = fixed || url;
              }
            } catch(_) {}
          }
          if (url) next[id] = url;
        }
        setProofURLs(next);
      } catch(_) {}
    })();
  }, [bookings]);

  const handleFileChange = (bookingId, file) => {
    setProofFiles(prev => ({ ...prev, [bookingId]: file }));
  };

  const handleMethodChange = (bookingId, method) => {
    setPaymentMethods(prev => ({ ...prev, [bookingId]: method }));
  };

  const handleUploadProof = async (booking) => {
    const current = auth?.currentUser;
    if (!current?.uid) return;
    const file = proofFiles?.[booking?.bookingId] || null;
    if (!file) {
      window.showNotification && window.showNotification({ type:'error', message:'Pilih file bukti pembayaran terlebih dahulu' });
      return;
    }
    setUploadingId(booking?.bookingId);
    try {
      let paymentId = null;
      const pRes = await getPaymentsByBooking(booking?.bookingId);
      const existing = pRes?.success ? (pRes?.payments?.[0] || null) : null;
      if (existing?.paymentId) {
        paymentId = existing?.paymentId;
      } else {
        const cRes = await createPayment({
          userId: current?.uid,
          bookingId: booking?.bookingId,
          fieldName: booking?.fieldName,
          bookingDate: booking?.date,
          bookingTime: booking?.startTime,
          duration: booking?.duration,
          totalAmount: booking?.totalPrice,
          paymentMethod: 'transfer',
          currency: 'IDR'
        });
        if (!cRes?.success) throw new Error(cRes?.error || 'Gagal membuat pembayaran');
        paymentId = cRes?.paymentId;
      }
      const uRes = await uploadPaymentProof(paymentId, file);
      if (uRes?.success) {
        window.showNotification && window.showNotification({ type:'success', message:'Bukti pembayaran terupload, menunggu verifikasi admin' });
      } else {
        throw new Error(uRes?.error || 'Gagal upload bukti');
      }
    } catch (e) {
      window.showNotification && window.showNotification({ type:'error', message: e?.message || 'Terjadi kesalahan' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleCashConfirm = async (booking) => {
    const current = auth?.currentUser;
    if (!current?.uid) return;
    try {
      const pRes = await getPaymentsByBooking(booking?.bookingId);
      const existing = pRes?.success ? (pRes?.payments?.[0] || null) : null;
      if (existing?.paymentId) {
        window.showNotification && window.showNotification({ type:'info', message:'Pembayaran cash sudah tercatat, menunggu konfirmasi admin' });
        return;
      }
      const cRes = await createPayment({
        userId: current?.uid,
        bookingId: booking?.bookingId,
        fieldName: booking?.fieldName,
        bookingDate: booking?.date,
        bookingTime: booking?.startTime,
        duration: booking?.duration,
        totalAmount: booking?.totalPrice,
        paymentMethod: 'cash',
        currency: 'IDR'
      });
      if (cRes?.success) {
        window.showNotification && window.showNotification({ type:'success', message:'Pembayaran cash tercatat. Admin akan mengkonfirmasi.' });
      } else {
        throw new Error(cRes?.error || 'Gagal mencatat pembayaran cash');
      }
    } catch (e) {
      window.showNotification && window.showNotification({ type:'error', message: e?.message || 'Terjadi kesalahan' });
    }
  };

  const canUpload = (b) => b?.status === 'confirmed' && b?.paymentStatus !== 'paid';

  return (
    <AuthenticationGuard requiredRole="customer">
      <div className="min-h-screen bg-background">
        <NavigationHeader userRole="customer" userName={userName} onLogout={() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          navigate('/authentication');
        }} />
        <NotificationSystem />
        <main className="pt-16 pb-20 md:pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card rounded-lg border border-border p-6 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">Booking Saya</h1>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Memuat...</div>
              ) : bookings?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Belum ada booking</div>
              ) : (
                <div className="divide-y divide-border">
                  {bookings?.map((b) => (
                    <div key={b?.bookingId || b?.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{b?.fieldName}</p>
                          <p className="text-lg font-semibold text-foreground">{b?.date} • {b?.startTime}</p>
                          <p className="text-sm text-muted-foreground">Durasi {b?.duration} jam</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-bold text-foreground">Rp {b?.totalPrice?.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {proofURLs?.[b?.bookingId || b?.id] && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-foreground flex items-center space-x-2 mb-2">
                      <Icon name="Image" size={16} />
                      <span>Bukti Pembayaran</span>
                    </div>
                    <div className="bg-background rounded-lg p-2 border border-border">
                      <img
                        src={proofURLs?.[b?.bookingId || b?.id]}
                        alt="Bukti Pembayaran"
                        className="max-h-64 w-auto object-contain"
                        onError={(e)=>{e.target.style.display='none'}}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm">
                    <span className="px-2 py-1 rounded bg-warning/10 text-warning">{b?.status === 'pending' ? 'Menunggu Persetujuan' : b?.status === 'confirmed' ? 'Dikonfirmasi' : b?.status}</span>
                    <span className="ml-2 px-2 py-1 rounded bg-muted/50 text-muted-foreground">{b?.paymentStatus === 'paid' ? 'Lunas' : b?.paymentStatus === 'verification_pending' ? 'Menunggu Verifikasi' : 'Belum Dibayar'}</span>
                  </div>
                        {canUpload(b) && (
                          <div className="flex items-center space-x-2">
                            <select
                              className="px-2 py-1 border border-border rounded text-sm bg-background text-foreground"
                              value={paymentMethods?.[b?.bookingId] || 'transfer'}
                              onChange={(e)=>handleMethodChange(b?.bookingId, e?.target?.value)}
                            >
                              <option value="transfer">Transfer</option>
                              <option value="cash">Cash</option>
                            </select>
                            {paymentMethods?.[b?.bookingId] === 'transfer' ? (
                              <>
                                <input type="file" accept="image/*" onChange={(e)=>handleFileChange(b?.bookingId, e?.target?.files?.[0])} />
                                <Button
                                  onClick={()=>handleUploadProof(b)}
                                  loading={uploadingId === (b?.bookingId)}
                                  iconName="Upload"
                                  iconPosition="left"
                                >
                                  Upload Bukti
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="success"
                                onClick={()=>handleCashConfirm(b)}
                                iconName="Check"
                                iconPosition="left"
                              >
                                Konfirmasi Cash
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <BottomNavigation userRole="customer" />
      </div>
    </AuthenticationGuard>
  );
};

export default MyBookings;
