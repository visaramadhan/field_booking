import React from 'react';
import Icon from '../AppIcon';

const BookingStatusIndicator = ({ status, showLabel = true, size = 'default' }) => {
  const statusConfig = {
    pending: {
      label: 'Menunggu Persetujuan',
      icon: 'Clock',
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      iconColor: 'var(--color-warning)',
    },
    confirmed: {
      label: 'Dikonfirmasi',
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      iconColor: 'var(--color-success)',
    },
    cancelled: {
      label: 'Dibatalkan',
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error/10',
      textColor: 'text-error',
      iconColor: 'var(--color-error)',
    },
    completed: {
      label: 'Selesai',
      icon: 'CheckCircle2',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      iconColor: 'var(--color-success)',
    },
    rejected: {
      label: 'Ditolak',
      icon: 'AlertCircle',
      color: 'destructive',
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      iconColor: 'var(--color-destructive)',
    },
  };

  const config = statusConfig?.[status] || statusConfig?.pending;
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const textSize = size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm';
  const paddingSize = size === 'small' ? 'px-2 py-1' : size === 'large' ? 'px-4 py-2' : 'px-3 py-1.5';

  return (
    <div className={`inline-flex items-center space-x-2 ${config?.bgColor} ${paddingSize} rounded-lg`}>
      <Icon name={config?.icon} size={iconSize} color={config?.iconColor} />
      {showLabel && (
        <span className={`font-medium ${config?.textColor} ${textSize}`}>
          {config?.label}
        </span>
      )}
    </div>
  );
};

export default BookingStatusIndicator;