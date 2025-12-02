import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FieldCard = ({ field, onEdit, onDelete, onViewDetails }) => {
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
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-smooth">
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={field?.image}
          alt={field?.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-3 right-3 ${statusConfig?.bgColor} ${statusConfig?.textColor} px-3 py-1.5 rounded-lg flex items-center space-x-2`}>
          <Icon name={statusConfig?.icon} size={16} />
          <span className="text-sm font-medium">{statusConfig?.label}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{field?.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{field?.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tarif per Jam</span>
            <span className="text-base font-semibold text-primary">{formatCurrency(field?.pricePerHour)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Maintenance Terakhir</span>
            <span className="text-sm text-foreground">{formatDate(field?.lastMaintenance)}</span>
          </div>

          {field?.amenities && field?.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {field?.amenities?.slice(0, 3)?.map((amenity, index) => (
                <span key={index} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                  {amenity}
                </span>
              ))}
              {field?.amenities?.length > 3 && (
                <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                  +{field?.amenities?.length - 3} lainnya
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => onViewDetails(field)}
            className="flex-1"
          >
            Detail
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(field)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="icon"
            iconName="Trash2"
            onClick={() => onDelete(field)}
          />
        </div>
      </div>
    </div>
  );
};

export default FieldCard;