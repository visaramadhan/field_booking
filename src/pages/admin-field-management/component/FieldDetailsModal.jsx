import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FieldDetailsModal = ({ isOpen, onClose, field }) => {
  if (!isOpen || !field) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belum ada';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })?.format(date);
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: 'Aktif',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        icon: 'CheckCircle'
      },
      maintenance: {
        label: 'Maintenance',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        icon: 'Wrench'
      },
      closed: {
        label: 'Tutup',
        bgColor: 'bg-error/10',
        textColor: 'text-error',
        icon: 'XCircle'
      }
    };
    return configs?.[status] || configs?.active;
  };

  const statusConfig = getStatusConfig(field?.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Detail Lapangan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth tap-target"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-64 rounded-lg overflow-hidden bg-muted">
            <Image
              src={field?.image}
              alt={field?.imageAlt}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 right-4 ${statusConfig?.bgColor} ${statusConfig?.textColor} px-4 py-2 rounded-lg flex items-center space-x-2`}>
              <Icon name={statusConfig?.icon} size={20} />
              <span className="font-medium">{statusConfig?.label}</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{field?.name}</h3>
            <p className="text-muted-foreground leading-relaxed">{field?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground">Tarif per Jam</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatCurrency(field?.pricePerHour)}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calendar" size={20} color="var(--color-primary)" />
                <span className="text-sm text-muted-foreground">Maintenance Terakhir</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{formatDate(field?.lastMaintenance)}</p>
            </div>
          </div>

          {field?.amenities && field?.amenities?.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
                <span>Fasilitas Tersedia</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {field?.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-lg">
                    <Icon name="Check" size={16} color="var(--color-success)" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {field?.bookingStats && (
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                <span>Statistik Booking</span>
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{field?.bookingStats?.totalBookings}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Booking</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-success">{formatCurrency(field?.bookingStats?.revenue)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pendapatan</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{field?.bookingStats?.utilizationRate}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Tingkat Penggunaan</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsModal;