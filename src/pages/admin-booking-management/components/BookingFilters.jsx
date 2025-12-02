import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BookingFilters = ({ filters, onFilterChange, onClearFilters, bookingCounts }) => {
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu Persetujuan' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'cancelled', label: 'Dibatalkan' },
    { value: 'completed', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  const fieldOptions = [
    { value: 'all', label: 'Semua Lapangan' },
    { value: 'field-1', label: 'Lapangan Futsal A' },
    { value: 'field-2', label: 'Lapangan Futsal B' },
    { value: 'field-3', label: 'Lapangan Basket Indoor' },
    { value: 'field-4', label: 'Lapangan Voli Outdoor' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Tanggal Terbaru' },
    { value: 'date-asc', label: 'Tanggal Terlama' },
    { value: 'price-desc', label: 'Harga Tertinggi' },
    { value: 'price-asc', label: 'Harga Terendah' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Filter & Pencarian</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClearFilters}
        >
          Hapus Filter
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Cari nama pengguna atau email..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Pilih status"
        />

        <Select
          options={fieldOptions}
          value={filters?.field}
          onChange={(value) => onFilterChange('field', value)}
          placeholder="Pilih lapangan"
        />

        <Select
          options={sortOptions}
          value={filters?.sort}
          onChange={(value) => onFilterChange('sort', value)}
          placeholder="Urutkan berdasarkan"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Dari Tanggal"
          value={filters?.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
        />

        <Input
          type="date"
          label="Sampai Tanggal"
          value={filters?.dateTo}
          onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
        />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Pending: <span className="font-semibold text-foreground">{bookingCounts?.pending}</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Dikonfirmasi: <span className="font-semibold text-foreground">{bookingCounts?.confirmed}</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Ditolak: <span className="font-semibold text-foreground">{bookingCounts?.rejected}</span></span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{bookingCounts?.total}</span> booking
        </p>
      </div>
    </div>
  );
};

export default BookingFilters;