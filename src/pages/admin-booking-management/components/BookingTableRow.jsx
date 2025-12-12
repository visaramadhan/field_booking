import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BookingStatusIndicator from '../../../components/navigation/BookingStatusIndicator';
import { getPaymentsByBooking, createPayment, uploadPaymentProof } from '../../../services/paymentService';

const BookingTableRow = ({ booking, onApprove, onReject, onDelete, onToggleDetails, isExpanded, onApprovePayment }) => {
  const [isProcessing, setIsProcessing] = useState(false);

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

  const [proofURL, setProofURL] = useState(null);
  const [adminMethod, setAdminMethod] = useState('cash');
  const [adminFile, setAdminFile] = useState(null);
  useEffect(()=>{
    (async ()=>{
      try {
        const res = await getPaymentsByBooking(booking?.id);
        const p = res?.success ? (res?.payments?.[0] || null) : null;
        setProofURL(p?.proofURL || null);
      } catch(_) {}
    })();
  }, [booking?.id]);

  const handleAdminRecordPayment = async () => {
    try {
      const res = await getPaymentsByBooking(booking?.id);
      const existing = res?.success ? (res?.payments?.[0] || null) : null;
      let paymentId = existing?.paymentId || null;
      if (!paymentId) {
        const cRes = await createPayment({
          bookingId: booking?.id,
          userId: 'admin-action',
          totalAmount: Number(booking?.totalPrice || 0),
          paymentMethod: adminMethod,
          currency: 'IDR',
          source: 'admin_manual'
        });
        if (!cRes?.success) throw new Error(cRes?.error || 'Gagal membuat pembayaran');
        paymentId = cRes?.paymentId;
      }
      if (adminMethod === 'transfer' && adminFile) {
        const uRes = await uploadPaymentProof(paymentId, adminFile);
        if (!uRes?.success) throw new Error(uRes?.error || 'Gagal upload bukti');
        setProofURL(uRes?.proofURL || null);
      }
      window.showNotification && window.showNotification({ type:'success', message:'Pembayaran manual tercatat' });
    } catch (e) {
      window.showNotification && window.showNotification({ type:'error', message: e?.message || 'Terjadi kesalahan' });
    }
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
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
        <td className="px-4 py-4">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            aria-label={`Pilih booking ${booking?.userName}`}
          />
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="font-medium text-foreground">{booking?.userName}</p>
              <p className="text-sm text-muted-foreground">{booking?.userEmail}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={18} color="var(--color-primary)" />
            <span className="font-medium text-foreground">{booking?.fieldName}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Calendar" size={16} />
              <span>{formatDateTime(booking?.date, booking?.startTime)}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>{booking?.duration} jam</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-4">
          <p className="font-semibold text-foreground">{formatCurrency(booking?.totalPrice)}</p>
        </td>
        <td className="px-4 py-4">
          <BookingStatusIndicator status={booking?.status} size="small" />
        </td>
        <td className="px-4 py-4">
          <p className="text-sm text-muted-foreground">{booking?.submittedAt}</p>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center space-x-2">
            {booking?.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="xs"
                  iconName="Check"
                  onClick={handleApprove}
                  disabled={isProcessing}
                  loading={isProcessing}
                >
                  Setujui
                </Button>
                <Button
                  variant="danger"
                  size="xs"
                  iconName="X"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  Tolak
                </Button>
              </>
            )}
            {booking?.paymentStatus === 'verification_pending' && (
              <Button
                variant="success"
                size="xs"
                iconName="Check"
                onClick={() => onApprovePayment(booking?.id)}
              >
                Setujui Pembayaran
              </Button>
            )}
            <Button
              variant="ghost"
              size="xs"
              iconName="Trash2"
              onClick={handleDelete}
              disabled={isProcessing}
            />
            <Button
              variant="ghost"
              size="xs"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => onToggleDetails(booking?.id)}
            />
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-muted/30 border-b border-border">
          <td colSpan="8" className="px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="FileText" size={18} />
                  <span>Detail Booking</span>
                </h4>
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
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="MessageSquare" size={18} />
                  <span>Catatan & Permintaan Khusus</span>
                </h4>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground">
                    {booking?.specialRequests || "Tidak ada permintaan khusus"}
                  </p>
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
                </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Catatan Admin:</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Tambahkan catatan internal..."
                  defaultValue={booking?.adminNotes}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1">Metode Pembayaran (Manual)</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" value={adminMethod} onChange={(e)=>setAdminMethod(e?.target?.value)}>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                  {adminMethod === 'transfer' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1">Upload Bukti</label>
                      <input type="file" accept="image/*" onChange={(e)=>setAdminFile(e?.target?.files?.[0] || null)} className="w-full" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" iconName="Receipt" iconPosition="left" onClick={handleAdminRecordPayment}>Catat Pembayaran</Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default BookingTableRow;
