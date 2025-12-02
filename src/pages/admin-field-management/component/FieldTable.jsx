import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FieldTable = ({ fields, onEdit, onDelete, onViewDetails, onSort }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
      month: 'short',
      year: 'numeric'
    })?.format(date);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={16} className="opacity-40" />;
    }
    return sortConfig?.direction === 'asc' ? (
      <Icon name="ArrowUp" size={16} />
    ) : (
      <Icon name="ArrowDown" size={16} />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth tap-target"
              >
                <span>Nama Lapangan</span>
                <SortIcon columnKey="name" />
              </button>
            </th>
            <th className="text-left py-4 px-4">
              <span className="text-sm font-semibold text-foreground">Deskripsi</span>
            </th>
            <th className="text-left py-4 px-4">
              <button
                onClick={() => handleSort('pricePerHour')}
                className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth tap-target"
              >
                <span>Tarif/Jam</span>
                <SortIcon columnKey="pricePerHour" />
              </button>
            </th>
            <th className="text-left py-4 px-4">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth tap-target"
              >
                <span>Status</span>
                <SortIcon columnKey="status" />
              </button>
            </th>
            <th className="text-left py-4 px-4">
              <button
                onClick={() => handleSort('lastMaintenance')}
                className="flex items-center space-x-2 text-sm font-semibold text-foreground hover:text-primary transition-smooth tap-target"
              >
                <span>Maintenance Terakhir</span>
                <SortIcon columnKey="lastMaintenance" />
              </button>
            </th>
            <th className="text-right py-4 px-4">
              <span className="text-sm font-semibold text-foreground">Aksi</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {fields?.map((field) => {
            const statusConfig = getStatusConfig(field?.status);
            return (
              <tr key={field?.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={field?.image}
                        alt={field?.imageAlt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>
                    <span className="font-medium text-foreground">{field?.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{field?.description}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-primary">{formatCurrency(field?.pricePerHour)}</span>
                </td>
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center space-x-2 ${statusConfig?.bgColor} ${statusConfig?.textColor} px-3 py-1.5 rounded-lg`}>
                    <Icon name={statusConfig?.icon} size={16} />
                    <span className="text-sm font-medium">{statusConfig?.label}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-foreground">{formatDate(field?.lastMaintenance)}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Eye"
                      onClick={() => onViewDetails(field)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Edit"
                      onClick={() => onEdit(field)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Trash2"
                      onClick={() => onDelete(field)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FieldTable;