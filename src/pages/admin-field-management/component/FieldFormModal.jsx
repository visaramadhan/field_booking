import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FieldFormModal = ({ isOpen, onClose, field, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    status: 'active',
    amenities: [],
    image: '',
    lastMaintenance: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amenitiesOptions = [
    'Lampu Penerangan',
    'Ruang Ganti',
    'Toilet',
    'Parkir',
    'Kantin',
    'Tribun Penonton',
    'Sound System',
    'Papan Skor'
  ];

  const statusOptions = [
    { value: 'active', label: 'Aktif' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'closed', label: 'Tutup' }
  ];

  useEffect(() => {
    if (field) {
      setFormData({
        name: field?.name || '',
        description: field?.description || '',
        pricePerHour: field?.pricePerHour || '',
        status: field?.status || 'active',
        amenities: field?.amenities || [],
        image: field?.image || '',
        lastMaintenance: field?.lastMaintenance || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        pricePerHour: '',
        status: 'active',
        amenities: [],
        image: '',
        lastMaintenance: ''
      });
    }
    setErrors({});
  }, [field, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev?.amenities?.includes(amenity)
        ? prev?.amenities?.filter(a => a !== amenity)
        : [...prev?.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nama lapangan wajib diisi';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    if (!formData?.pricePerHour || formData?.pricePerHour <= 0) {
      newErrors.pricePerHour = 'Tarif harus lebih dari 0';
    }

    if (!formData?.image?.trim()) {
      newErrors.image = 'URL gambar wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fieldData = {
        ...formData,
        pricePerHour: Number(formData?.pricePerHour),
        lastMaintenance: formData?.lastMaintenance || new Date()?.toISOString()?.split('T')?.[0]
      };

      if (field) {
        fieldData.id = field?.id;
      }

      await onSave(fieldData);
      
      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: field ? 'Lapangan berhasil diperbarui' : 'Lapangan baru berhasil ditambahkan'
        });
      }

      onClose();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification({
          type: 'error',
          message: 'Gagal menyimpan data lapangan'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {field ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth tap-target"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Nama Lapangan"
            type="text"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            placeholder="Contoh: Lapangan Futsal A"
            error={errors?.name}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Deskripsi <span className="text-error">*</span>
            </label>
            <textarea
              name="description"
              value={formData?.description}
              onChange={handleChange}
              placeholder="Deskripsi detail tentang lapangan..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors?.description ? 'border-error' : 'border-input'
              }`}
            />
            {errors?.description && (
              <p className="text-sm text-error mt-1">{errors?.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tarif per Jam (IDR)"
              type="number"
              name="pricePerHour"
              value={formData?.pricePerHour}
              onChange={handleChange}
              placeholder="100000"
              error={errors?.pricePerHour}
              required
            />

            <Select
              label="Status Operasional"
              options={statusOptions}
              value={formData?.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              required
            />
          </div>

          <Input
            label="URL Gambar"
            type="url"
            name="image"
            value={formData?.image}
            onChange={handleChange}
            placeholder="https://example.com/field-image.jpg"
            error={errors?.image}
            required
          />

          <Input
            label="Tanggal Maintenance Terakhir"
            type="date"
            name="lastMaintenance"
            value={formData?.lastMaintenance}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Fasilitas Tersedia
            </label>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesOptions?.map((amenity) => (
                <Checkbox
                  key={amenity}
                  label={amenity}
                  checked={formData?.amenities?.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Save"
              iconPosition="left"
            >
              {field ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldFormModal;