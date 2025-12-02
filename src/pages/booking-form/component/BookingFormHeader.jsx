import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingFormHeader = ({ onBack }) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-smooth tap-target"
            aria-label="Kembali ke jadwal"
          >
            <Icon name="ArrowLeft" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Form Booking Lapangan</h1>
            <p className="text-sm text-muted-foreground mt-1">Lengkapi informasi booking Anda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormHeader;