import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BookingDetailsForm = ({ formData, errors, onChange }) => {
  const durationOptions = [
    { value: '1', label: '1 Jam' },
    { value: '2', label: '2 Jam' },
    { value: '3', label: '3 Jam' },
    { value: '4', label: '4 Jam' }
  ];

  const purposeOptions = [
    { value: 'futsal', label: 'Futsal' },
    { value: 'sepak_bola', label: 'Sepak Bola' },
    { value: 'latihan_tim', label: 'Latihan Tim' },
    { value: 'turnamen', label: 'Turnamen' },
    { value: 'rekreasi', label: 'Rekreasi' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="ClipboardList" size={20} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Detail Booking</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tanggal Booking"
            type="date"
            name="bookingDate"
            value={formData?.bookingDate}
            onChange={onChange}
            required
            error={errors?.bookingDate}
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />
          
          <Input
            label="Waktu Mulai"
            type="time"
            name="startTime"
            value={formData?.startTime}
            onChange={onChange}
            required
            error={errors?.startTime}
          />
        </div>

        <Select
          label="Durasi Booking"
          options={durationOptions}
          value={formData?.duration}
          onChange={(value) => onChange({ target: { name: 'duration', value } })}
          required
          error={errors?.duration}
          placeholder="Pilih durasi"
        />

        <Select
          label="Tujuan Booking"
          options={purposeOptions}
          value={formData?.purpose}
          onChange={(value) => onChange({ target: { name: 'purpose', value } })}
          required
          error={errors?.purpose}
          placeholder="Pilih tujuan booking"
        />

        <Input
          label="Nomor Telepon"
          type="tel"
          name="phoneNumber"
          value={formData?.phoneNumber}
          onChange={onChange}
          placeholder="08xxxxxxxxxx"
          required
          error={errors?.phoneNumber}
          pattern="[0-9]{10,13}"
          description="Format: 08xxxxxxxxxx (10-13 digit)"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Catatan Khusus <span className="text-muted-foreground">(Opsional)</span>
          </label>
          <textarea
            name="specialRequirements"
            value={formData?.specialRequirements}
            onChange={onChange}
            rows={4}
            className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth resize-none"
            placeholder="Tambahkan catatan atau permintaan khusus untuk booking Anda..."
          />
          {errors?.specialRequirements && (
            <p className="text-sm text-error mt-1">{errors?.specialRequirements}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsForm;