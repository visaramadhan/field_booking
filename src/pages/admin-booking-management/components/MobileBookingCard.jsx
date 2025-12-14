import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BookingStatusIndicator from '../../../components/navigation/BookingStatusIndicator';
import { getPaymentsByBooking } from '../../../services/paymentService';
import { storage } from '../../../config/firebase';
import { ref as storageRef, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

const MobileBookingCard = ({ booking, onApprove, onReject, onDelete, onApprovePayment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proofURL, setProofURL] = useState(null);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await getPaymentsByBooking(booking?.bookingId || booking?.id);
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
        setProofURL(url);
      } catch(_) {}
    })();
  }, [booking?.bookingId, booking?.id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(booking?.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(booking?.id);
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    await onDelete(booking?.id);
    setIsProcessing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date?.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return `${formattedDate} ${timeString}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden booking-card-hover">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{booking?.userName}</p>
              <p className="text-sm text-muted-foreground truncate">{booking?.userEmail}</p>
            </div>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary flex-shrink-0 tap-target"
            aria-label={`Pilih booking ${booking?.userName}`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={18} color="var(--color-primary)" />
            <span className="font-medium text-foreground">{booking?.fieldName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={16} />
            <span>{formatDateTime(booking?.date, booking?.startTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>{booking?.duration} jam</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <p className="text-lg font-bold text-foreground">{formatCurrency(booking?.totalPrice)}</p>
          <BookingStatusIndicator status={booking?.status} size="small" />
        </div>

        {booking?.status === 'pending' && (
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              onClick={handleApprove}
              disabled={isProcessing}
              loading={isProcessing}
              fullWidth
            >
              Setujui
            </Button>
            <Button
              variant="danger"
              size="sm"
              iconName="X"
              onClick={handleReject}
              disabled={isProcessing}
              fullWidth
            >
              Tolak
            </Button>
          </div>
        )}
        {(booking?.paymentStatus === 'verification_pending' || booking?.paymentStatus === 'pending') && (
          <div className="pt-2">
            <Button
              variant="success"
              size="sm"
              iconName="Check"
              onClick={() => onApprovePayment(booking?.bookingId || booking?.id)}
              fullWidth
            >
              Setujui Pembayaran
            </Button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
            fullWidth
          >
            {isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={handleDelete}
            disabled={isProcessing}
          />
        </div>

        {isExpanded && (
          <div className="pt-4 border-t border-border space-y-4 animate-in slide-in-from-top duration-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID Booking:</span>
                <span className="font-medium text-foreground">{booking?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor Telepon:</span>
                <span className="font-medium text-foreground">{booking?.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waktu Selesai:</span>
                <span className="font-medium text-foreground">{booking?.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status Pembayaran:</span>
                <span className={`font-medium ${booking?.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                  {booking?.paymentStatus === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diajukan:</span>
                <span className="font-medium text-foreground">{booking?.submittedAt}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Permintaan Khusus:</p>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-foreground">
                  {booking?.specialRequests || "Tidak ada permintaan khusus"}
                </p>
              </div>
            </div>

            {proofURL && (
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="Image" size={18} />
                  <span>Bukti Pembayaran</span>
                </h4>
                <div className="bg-background rounded-lg p-2 border border-border">
                  <img src={proofURL} alt="Bukti Pembayaran" className="max-h-64 w-auto object-contain" onError={(e)=>{e.target.style.display='none'}} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Catatan Admin:</label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none tap-target"
                rows="3"
                placeholder="Tambahkan catatan internal..."
                defaultValue={booking?.adminNotes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileBookingCard;
