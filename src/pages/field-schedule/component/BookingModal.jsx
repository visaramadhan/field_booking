import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BookingModal = ({ field, selectedDate, selectedTime, onClose, onConfirm }) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState('');

  const formatDate = (date) => {
    const day = String(date?.getDate())?.padStart(2, '0');
    const month = String(date?.getMonth() + 1)?.padStart(2, '0');
    const year = date?.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateEndTime = (startTime, hours) => {
    const [hour, minute] = startTime?.split(':')?.map(Number);
    const endHour = hour + hours;
    return `${String(endHour)?.padStart(2, '0')}:${String(minute)?.padStart(2, '0')}`;
  };

  const calculateTotal = () => {
    return field?.price * duration;
  };

  const handleConfirm = () => {
    const bookingData = {
      fieldId: field?.id,
      fieldName: field?.name,
      date: formatDate(selectedDate),
      startTime: selectedTime,
      endTime: calculateEndTime(selectedTime, duration),
      duration: duration,
      price: field?.price,
      total: calculateTotal(),
      notes: notes,
      status: 'pending'
    };

    onConfirm(bookingData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Konfirmasi Booking</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth tap-target"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Field Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">{field?.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="font-medium text-foreground">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Waktu Mulai:</span>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Harga per Jam:</span>
                <span className="font-medium text-foreground">Rp {field?.price?.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Durasi (Jam)
            </label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Minus"
                onClick={() => setDuration(Math.max(1, duration - 1))}
                disabled={duration <= 1}
              />
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-foreground">{duration}</span>
                <span className="text-sm text-muted-foreground ml-2">jam</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                onClick={() => setDuration(Math.min(5, duration + 1))}
                disabled={duration >= 5}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Waktu Selesai: {calculateEndTime(selectedTime, duration)}
            </p>
          </div>

          {/* Notes */}
          <div>
            <Input
              type="text"
              label="Catatan (Opsional)"
              placeholder="Tambahkan catatan untuk booking Anda..."
              value={notes}
              onChange={(e) => setNotes(e?.target?.value)}
              description="Contoh: Untuk turnamen, butuh bola tambahan, dll."
            />
          </div>

          {/* Total Price */}
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-primary">
                Rp {calculateTotal()?.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                Booking Anda akan menunggu persetujuan admin. Anda akan menerima notifikasi setelah booking dikonfirmasi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            variant="default"
            iconName="CheckCircle"
            iconPosition="left"
            onClick={handleConfirm}
          >
            Konfirmasi Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;