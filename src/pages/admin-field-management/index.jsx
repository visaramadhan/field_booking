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
import { createScheduleSlot, listenSchedules } from '../../services/scheduleService';

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
  const [scheduleForm, setScheduleForm] = useState({ fieldName:'', date:'', startTime:'', endTime:'' });
  const [schedules, setSchedules] = useState([]);

  const mockFields = [
  {
    id: 1,
    name: "Lapangan Futsal A",
    description: "Lapangan futsal standar internasional dengan rumput sintetis berkualitas tinggi. Dilengkapi dengan lampu penerangan LED yang terang untuk permainan malam hari. Tersedia ruang ganti yang nyaman dan toilet bersih.",
    pricePerHour: 150000,
    status: "active",
    image: "https://images.unsplash.com/photo-1486808167956-e146059afcf0",
    imageAlt: "Modern indoor futsal court with bright green synthetic turf and white boundary lines under LED lighting",
    lastMaintenance: "2025-01-15",
    amenities: ["Lampu Penerangan", "Ruang Ganti", "Toilet", "Parkir", "Kantin"],
    bookingStats: {
      totalBookings: 145,
      revenue: 21750000,
      utilizationRate: 78
    }
  },
  {
    id: 2,
    name: "Lapangan Futsal B",
    description: "Lapangan futsal outdoor dengan sistem drainase yang baik. Cocok untuk latihan tim dan pertandingan persahabatan. Memiliki tribun penonton dengan kapasitas 50 orang.",
    pricePerHour: 120000,
    status: "active",
    image: "https://images.unsplash.com/photo-1679061399471-664d5e0d4c56",
    imageAlt: "Outdoor futsal field with green artificial grass surrounded by protective fencing and spectator stands",
    lastMaintenance: "2025-01-10",
    amenities: ["Lampu Penerangan", "Tribun Penonton", "Parkir", "Toilet"],
    bookingStats: {
      totalBookings: 98,
      revenue: 11760000,
      utilizationRate: 65
    }
  },
  {
    id: 3,
    name: "Lapangan Basket Indoor",
    description: "Lapangan basket indoor dengan lantai parket berkualitas tinggi dan ring standar NBA. Dilengkapi dengan AC dan sound system untuk acara pertandingan. Kapasitas penonton hingga 200 orang.",
    pricePerHour: 200000,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1592836981753-d2cdbbf1b3ec",
    imageAlt: "Professional indoor basketball court with polished wooden floor, regulation hoops, and stadium seating",
    lastMaintenance: "2025-01-18",
    amenities: ["Lampu Penerangan", "Ruang Ganti", "Toilet", "Parkir", "Tribun Penonton", "Sound System", "Papan Skor"],
    bookingStats: {
      totalBookings: 67,
      revenue: 13400000,
      utilizationRate: 45
    }
  },
  {
    id: 4,
    name: "Lapangan Voli Pantai",
    description: "Lapangan voli pantai dengan pasir putih berkualitas premium. Lokasi outdoor dengan pemandangan yang indah. Tersedia area duduk untuk penonton dan kantin dengan menu minuman segar.",
    pricePerHour: 100000,
    status: "active",
    image: "https://images.unsplash.com/photo-1598446522563-70a506175b5d",
    imageAlt: "Beach volleyball court with white sand, regulation net, and palm trees in tropical outdoor setting",
    lastMaintenance: "2025-01-05",
    amenities: ["Lampu Penerangan", "Parkir", "Kantin", "Toilet"],
    bookingStats: {
      totalBookings: 52,
      revenue: 5200000,
      utilizationRate: 35
    }
  },
  {
    id: 5,
    name: "Lapangan Badminton Hall",
    description: "Hall badminton dengan 6 lapangan standar internasional. Lantai karet anti-slip dan pencahayaan optimal untuk permainan profesional. Dilengkapi dengan ruang tunggu ber-AC dan loker penyimpanan.",
    pricePerHour: 80000,
    status: "active",
    image: "https://images.unsplash.com/photo-1670435972971-36e0b43fd746",
    imageAlt: "Indoor badminton hall with multiple courts featuring blue flooring, white lines, and professional lighting",
    lastMaintenance: "2025-01-12",
    amenities: ["Lampu Penerangan", "Ruang Ganti", "Toilet", "Parkir"],
    bookingStats: {
      totalBookings: 189,
      revenue: 15120000,
      utilizationRate: 82
    }
  },
  {
    id: 6,
    name: "Lapangan Tenis Outdoor",
    description: "Lapangan tenis outdoor dengan permukaan hard court. Tersedia 2 lapangan dengan net standar ITF. Area parkir luas dan fasilitas shower untuk kenyamanan setelah bermain.",
    pricePerHour: 130000,
    status: "closed",
    image: "https://images.unsplash.com/photo-1659427948877-526b77c74732",
    imageAlt: "Outdoor tennis court with blue hard surface, white boundary lines, and green net under clear sky",
    lastMaintenance: "2024-12-20",
    amenities: ["Lampu Penerangan", "Ruang Ganti", "Toilet", "Parkir"],
    bookingStats: {
      totalBookings: 34,
      revenue: 4420000,
      utilizationRate: 23
    }
  }];


  useEffect(() => {
    setFields(mockFields);
    setFilteredFields(mockFields);
    const unsub = listenSchedules((items)=> setSchedules(items || []));
    return () => { if (unsub) unsub(); };
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
      setFields((prev) => prev?.map((f) => f?.id === fieldData?.id ? { ...f, ...fieldData } : f));
    } else {
      const newField = {
        ...fieldData,
        id: Date.now(),
        imageAlt: `Professional sports field facility for ${fieldData?.name} with modern amenities and equipment`,
        bookingStats: {
          totalBookings: 0,
          revenue: 0,
          utilizationRate: 0
        }
      };
      setFields((prev) => [...prev, newField]);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    setTimeout(() => {
      setFields((prev) => prev?.filter((f) => f?.id !== selectedField?.id));

      if (window.showNotification) {
        window.showNotification({
          type: 'success',
          message: 'Lapangan berhasil dihapus'
        });
      }

      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedField(null);
    }, 1000);
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
                  <Icon name="Calendar" size={20} color="var(--color-primary)" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Buat Jadwal Lapangan</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Nama Lapangan" value={scheduleForm?.fieldName} onChange={(e)=>setScheduleForm({...scheduleForm, fieldName:e?.target?.value})} />
              <Input label="Tanggal" type="date" value={scheduleForm?.date} onChange={(e)=>setScheduleForm({...scheduleForm, date:e?.target?.value})} />
              <Input label="Waktu Mulai" type="time" value={scheduleForm?.startTime} onChange={(e)=>setScheduleForm({...scheduleForm, startTime:e?.target?.value})} />
              <Input label="Waktu Selesai" type="time" value={scheduleForm?.endTime} onChange={(e)=>setScheduleForm({...scheduleForm, endTime:e?.target?.value})} />
            </div>
            <div className="flex items-center justify-end mt-4">
              <Button
                variant="success"
                iconName="Save"
                iconPosition="left"
                onClick={async ()=>{
                  const res = await createScheduleSlot({ ...scheduleForm, status:'available' });
                  if (res?.success) {
                    window.showNotification && window.showNotification({ type:'success', message:'Jadwal berhasil dibuat' });
                    setScheduleForm({ fieldName:'', date:'', startTime:'', endTime:'' });
                  } else {
                    window.showNotification && window.showNotification({ type:'error', message: res?.error || 'Gagal membuat jadwal' });
                  }
                }}
              >
                Simpan Jadwal
              </Button>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Jadwal Terbaru</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {schedules?.slice(0,6)?.map((sc)=>(
                  <div key={sc?.id} className="p-3 border border-border rounded">
                    <div className="text-sm font-medium text-foreground">{sc?.fieldName}</div>
                    <div className="text-xs text-muted-foreground">{sc?.date} • {sc?.startTime} - {sc?.endTime}</div>
                  </div>
                ))}
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