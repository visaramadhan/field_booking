import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FieldFilterPanel = ({ filters, onFilterChange, onResetFilters }) => {
  const fieldTypeOptions = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'futsal', label: 'Lapangan Futsal' },
    { value: 'badminton', label: 'Lapangan Badminton' },
    { value: 'basketball', label: 'Lapangan Basket' },
    { value: 'tennis', label: 'Lapangan Tenis' },
    { value: 'volleyball', label: 'Lapangan Voli' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'Semua Harga' },
    { value: '0-100000', label: 'Di bawah Rp 100.000' },
    { value: '100000-200000', label: 'Rp 100.000 - Rp 200.000' },
    { value: '200000-300000', label: 'Rp 200.000 - Rp 300.000' },
    { value: '300000-500000', label: 'Rp 300.000 - Rp 500.000' },
    { value: '500000+', label: 'Di atas Rp 500.000' }
  ];

  const timeSlotOptions = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'morning', label: 'Pagi (06:00 - 12:00)' },
    { value: 'afternoon', label: 'Siang (12:00 - 18:00)' },
    { value: 'evening', label: 'Malam (18:00 - 23:00)' }
  ];

  const hasActiveFilters = 
    filters?.fieldType !== 'all' || 
    filters?.priceRange !== 'all' || 
    filters?.timeSlot !== 'all' || 
    filters?.searchQuery !== '';

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Filter Lapangan</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={onResetFilters}
          >
            Reset Filter
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <Input
            type="search"
            placeholder="Cari nama lapangan..."
            value={filters?.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Field Type Filter */}
        <div>
          <Select
            placeholder="Pilih jenis lapangan"
            options={fieldTypeOptions}
            value={filters?.fieldType}
            onChange={(value) => onFilterChange('fieldType', value)}
          />
        </div>

        {/* Price Range Filter */}
        <div>
          <Select
            placeholder="Pilih rentang harga"
            options={priceRangeOptions}
            value={filters?.priceRange}
            onChange={(value) => onFilterChange('priceRange', value)}
          />
        </div>

        {/* Time Slot Filter */}
        <div>
          <Select
            placeholder="Pilih waktu"
            options={timeSlotOptions}
            value={filters?.timeSlot}
            onChange={(value) => onFilterChange('timeSlot', value)}
          />
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filter aktif:</span>
            {filters?.searchQuery && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                <span>Pencarian: {filters?.searchQuery}</span>
                <button
                  onClick={() => onFilterChange('searchQuery', '')}
                  className="hover:opacity-70 transition-smooth"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            {filters?.fieldType !== 'all' && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                <span>Jenis: {fieldTypeOptions?.find(opt => opt?.value === filters?.fieldType)?.label}</span>
                <button
                  onClick={() => onFilterChange('fieldType', 'all')}
                  className="hover:opacity-70 transition-smooth"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            {filters?.priceRange !== 'all' && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                <span>Harga: {priceRangeOptions?.find(opt => opt?.value === filters?.priceRange)?.label}</span>
                <button
                  onClick={() => onFilterChange('priceRange', 'all')}
                  className="hover:opacity-70 transition-smooth"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
            {filters?.timeSlot !== 'all' && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                <span>Waktu: {timeSlotOptions?.find(opt => opt?.value === filters?.timeSlot)?.label}</span>
                <button
                  onClick={() => onFilterChange('timeSlot', 'all')}
                  className="hover:opacity-70 transition-smooth"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldFilterPanel;