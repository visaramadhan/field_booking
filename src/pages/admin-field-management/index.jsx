import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import AuthenticationGuard from '../../components/navigation/AuthenticationGuard';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FieldCard from './component/FieldCard';
import FieldTable from './component/FieldTable';
import FieldFormModal from './component/FieldFormModal';
import FieldDetailsModal from './component/FieldDetailsModal';
import DeleteConfirmationModal from './component/DeleteConfirmationModal';
import FieldAnalytics from './component/FieldAnalytics';
import { getBusinessSettings, saveBusinessSettings } from '../../services/settingsService';
import { listenFields, createField, updateField, deleteField } from '../../services/fieldService';

const AdminFieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [businessSettings, setBusinessSettings] = useState({
    weekdayHours: { start: '08:00', end: '22:00' },
    weekendHours: { start: '06:00', end: '24:00' },
    holidays: []
  });

  const mockFields = [];


  useEffect(() => {
    const unsubFields = listenFields((items)=>{
      setFields(items || []);
      setFilteredFields(items || []);
    });
    (async ()=>{
      const res = await getBusinessSettings();
      if (res?.success && res?.data) {
        setBusinessSettings(res?.data);
      }
    })();
    return () => { if (unsubFields) unsubFields(); };
  }, []);

  useEffect(() => {
    let result = [...fields];

    if (searchQuery?.trim()) {
      result = result?.filter((field) =>
      field?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      field?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result?.filter((field) => field?.status === statusFilter);
    }

    setFilteredFields(result);
  }, [searchQuery, statusFilter, fields]);

  const handleSort = (key, direction) => {
    const sorted = [...filteredFields]?.sort((a, b) => {
      let aValue = a?.[key];
      let bValue = b?.[key];

      if (key === 'pricePerHour') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (key === 'lastMaintenance') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string') {
        return direction === 'asc' ?
        aValue?.localeCompare(bValue) :
        bValue?.localeCompare(aValue);
      }

      return 0;
    });

    setFilteredFields(sorted);
  };

  const handleAddField = () => {
    setSelectedField(null);
    setIsFormModalOpen(true);
  };

  const handleEditField = (field) => {
    setSelectedField(field);
    setIsFormModalOpen(true);
  };

  const handleDeleteField = (field) => {
    setSelectedField(field);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (field) => {
    setSelectedField(field);
    setIsDetailsModalOpen(true);
  };

  const handleSaveField = async (fieldData) => {
    if (fieldData?.id) {
      const res = await updateField(fieldData?.id?.toString(), fieldData);
      return res;
    } else {
      const res = await createField({
        ...fieldData,
        imageAlt: `Professional sports field facility for ${fieldData?.name} with modern amenities and equipment`,
        bookingStats: { totalBookings: 0, revenue: 0, utilizationRate: 0 }
      });
      return res;
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteField(selectedField?.id?.toString());
      window.showNotification && window.showNotification({ type:'success', message:'Lapangan berhasil dihapus' });
    } catch (e) {
      window.showNotification && window.showNotification({ type:'error', message:'Gagal menghapus lapangan' });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedField(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'closed', label: 'Tutup' }];


  return (
    <AuthenticationGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        <NavigationHeader
          userRole="admin"
          userName="Administrator"
          onLogout={handleLogout} />


        <main className="container mx-auto px-4 pt-20 pb-24 md:pb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Kelola Lapangan</h1>
            <p className="text-muted-foreground">Manajemen inventaris dan konfigurasi fasilitas lapangan</p>
          </div>

          <FieldAnalytics fields={fields} />

          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Cari nama atau deskripsi lapangan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)} />

                </div>
                <div className="w-full sm:w-48">
                  <Select
                    options={statusOptions}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Filter Status" />

                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded transition-smooth tap-target ${
                    viewMode === 'table' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`
                    }>

                    <Icon name="Table" size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-smooth tap-target ${
                    viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`
                    }>

                    <Icon name="LayoutGrid" size={20} />
                  </button>
                </div>

                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddField}>

                  Tambah Lapangan Baru
                </Button>
              </div>
            </div>

            {filteredFields?.length === 0 ?
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                  <Icon name="MapPin" size={32} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Tidak ada lapangan ditemukan</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' ? 'Coba ubah filter pencarian Anda' : 'Mulai dengan menambahkan lapangan baru'}
                </p>
                {!searchQuery && statusFilter === 'all' &&
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddField}>

                    Tambah Lapangan
                  </Button>
              }
              </div> :
            viewMode === 'table' ?
            <FieldTable
              fields={filteredFields}
              onEdit={handleEditField}
              onDelete={handleDeleteField}
              onViewDetails={handleViewDetails}
              onSort={handleSort} /> :


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFields?.map((field) =>
              <FieldCard
                key={field?.id}
                field={field}
                onEdit={handleEditField}
                onDelete={handleDeleteField}
                onViewDetails={handleViewDetails} />

              )}
              </div>
            }
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} color="var(--color-primary)" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Pengaturan Jam Operasional & Tanggal Libur</h2>
              </div>
              <Button
                variant="default"
                iconName="Save"
                iconPosition="left"
                onClick={async ()=>{
                  const res = await saveBusinessSettings(businessSettings);
                  if (res?.success) {
                    window.showNotification && window.showNotification({ type:'success', message:'Pengaturan operasional tersimpan' });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal menyimpan pengaturan' });
                  }
                }}
              >
                Simpan Pengaturan
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Senin - Jumat</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Mulai" type="time" value={businessSettings?.weekdayHours?.start} onChange={(e)=>setBusinessSettings(prev=>({ ...prev, weekdayHours:{ ...prev?.weekdayHours, start:e?.target?.value } }))} />
                  <Input label="Selesai" type="time" value={businessSettings?.weekdayHours?.end} onChange={(e)=>setBusinessSettings(prev=>({ ...prev, weekdayHours:{ ...prev?.weekdayHours, end:e?.target?.value } }))} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Sabtu - Minggu</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Mulai" type="time" value={businessSettings?.weekendHours?.start} onChange={(e)=>setBusinessSettings(prev=>({ ...prev, weekendHours:{ ...prev?.weekendHours, start:e?.target?.value } }))} />
                  <Input label="Selesai" type="time" value={businessSettings?.weekendHours?.end} onChange={(e)=>setBusinessSettings(prev=>({ ...prev, weekendHours:{ ...prev?.weekendHours, end:e?.target?.value } }))} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Tanggal Libur (YYYY-MM-DD, pisahkan dengan koma)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  value={(businessSettings?.holidays || [])?.join(',')}
                  onChange={(e)=>{
                    const val = e?.target?.value;
                    const arr = val?.split(',')?.map(s=> s?.trim())?.filter(Boolean);
                    setBusinessSettings(prev=> ({ ...prev, holidays: arr }));
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">Contoh: 2025-12-25, 2026-01-01</p>
              </div>
            </div>
          </div>
        </main>

        <BottomNavigation userRole="admin" />

        <FieldFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedField(null);
          }}
          field={selectedField}
          onSave={handleSaveField} />


        <FieldDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedField(null);
          }}
          field={selectedField} />


        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedField(null);
          }}
          onConfirm={confirmDelete}
          fieldName={selectedField?.name}
          isDeleting={isDeleting} />


        <NotificationSystem />
      </div>
    </AuthenticationGuard>);

};

export default AdminFieldManagement;
