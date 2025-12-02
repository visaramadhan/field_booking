import React from 'react';
import Button from '../../../components/ui/Button';

const BookingActions = ({ onSubmit, onCancel, isSubmitting, isFormValid }) => {
  return (
    <div className="bg-card border-t border-border sticky bottom-0 md:relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
            iconName="ArrowLeft"
            iconPosition="left"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Kembali ke Jadwal
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={!isFormValid || isSubmitting}
            iconName="CheckCircle"
            iconPosition="right"
            className="w-full sm:flex-1 order-1 sm:order-2"
          >
            {isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingActions;