import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/navigation/NavigationHeader';
import BottomNavigation from '../../components/navigation/BottomNavigation';
import NotificationSystem from '../../components/navigation/NotificationSystem';
import ScheduleCalendar from './components/ScheduleCalendar';
import FieldFilterPanel from './components/FieldFilterPanel';
import FieldDetailCard from './components/FieldDetailCard';
import BookingModal from './components/BookingModal';
import FieldListView from './components/FieldListView';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FieldSchedule = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedField, setSelectedField] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSlot, setBookingSlot] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('customer');

  const [filters, setFilters] = useState({
    searchQuery: '',
    fieldType: 'all',
    priceRange: 'all',
    timeSlot: 'all'
  });

  const mockFields = [
  {
    id: 1,
    name: "Lapangan Futsal A",
    type: "Lapangan Futsal",
    description: "Lapangan futsal indoor dengan lantai vinyl berkualitas tinggi, pencahayaan LED terang, dan sistem ventilasi modern. Dilengkapi dengan gawang standar FIFA dan jaring pengaman di sekeliling lapangan.",
    image: "https://images.unsplash.com/photo-1670435972971-36e0b43fd746",
    imageAlt: "Modern indoor futsal court with bright LED lighting, green vinyl flooring, white boundary lines, and professional goal posts with safety nets",
    price: 150000,
    size: "40m x 20m",
    capacity: "10-12 pemain",
    surface: "Vinyl",
    indoor: true,
    amenities: ["Parkir", "Toilet", "Kantin", "Ruang Ganti", "Lampu", "AC"]
  },
  {
    id: 2,
    name: "Lapangan Futsal B",
    type: "Lapangan Futsal",
    description: "Lapangan futsal outdoor dengan rumput sintetis premium, drainase sempurna untuk kondisi hujan, dan pencahayaan floodlight untuk bermain malam hari. Area tribun tersedia untuk penonton.",
    image: "https://images.unsplash.com/photo-1679061399471-664d5e0d4c56",
    imageAlt: "Outdoor futsal field with premium synthetic grass, white boundary markings, floodlight towers, and spectator seating area under blue sky",
    price: 120000,
    size: "40m x 20m",
    capacity: "10-12 pemain",
    surface: "Rumput Sintetis",
    indoor: false,
    amenities: ["Parkir", "Toilet", "Kantin", "Tribun", "Lampu"]
  },
  {
    id: 3,
    name: "Lapangan Badminton 1",
    type: "Lapangan Badminton",
    description: "Lapangan badminton indoor dengan lantai kayu parket standar internasional, plafon tinggi 9 meter, dan pencahayaan tanpa bayangan. Dilengkapi dengan net berkualitas tinggi dan sistem scoring digital.",
    image: "https://images.unsplash.com/photo-1670435972971-36e0b43fd746",
    imageAlt: "Professional indoor badminton court with polished wooden floor, high ceiling, bright shadowless lighting, white boundary lines, and regulation net",
    price: 80000,
    size: "13.4m x 6.1m",
    capacity: "2-4 pemain",
    surface: "Kayu Parket",
    indoor: true,
    amenities: ["Parkir", "Toilet", "Ruang Ganti", "AC", "Lampu"]
  },
  {
    id: 4,
    name: "Lapangan Basket",
    type: "Lapangan Basket",
    description: "Lapangan basket outdoor dengan permukaan akrilik anti-slip, ring basket standar NBA dengan papan fiber glass, dan marking garis yang jelas. Area bermain luas dengan zona aman di sekeliling lapangan.",
    image: "https://images.unsplash.com/photo-1693944014082-a208271fecc8",
    imageAlt: "Outdoor basketball court with orange acrylic surface, white boundary lines, professional hoops with transparent backboards, and safety zones",
    price: 100000,
    size: "28m x 15m",
    capacity: "10-12 pemain",
    surface: "Akrilik",
    indoor: false,
    amenities: ["Parkir", "Toilet", "Kantin", "Tribun", "Lampu"]
  },
  {
    id: 5,
    name: "Lapangan Tenis",
    type: "Lapangan Tenis",
    description: "Lapangan tenis hard court dengan permukaan cushioned acrylic untuk kenyamanan bermain, net standar ITF, dan pencahayaan profesional untuk pertandingan malam. Dilengkapi dengan kursi wasit dan area penonton.",
    image: "https://images.unsplash.com/photo-1582412786662-84de0f923f5f",
    imageAlt: "Professional tennis hard court with blue cushioned acrylic surface, white boundary lines, regulation net, umpire chair, and spectator seating",
    price: 120000,
    size: "23.77m x 10.97m",
    capacity: "2-4 pemain",
    surface: "Hard Court",
    indoor: false,
    amenities: ["Parkir", "Toilet", "Kantin", "Tribun", "Lampu"]
  },
  {
    id: 6,
    name: "Lapangan Voli",
    type: "Lapangan Voli",
    description: "Lapangan voli indoor dengan lantai vinyl khusus olahraga, net standar FIVB dengan sistem tensioning, dan pencahayaan optimal tanpa silau. Ruang bermain luas dengan zona bebas yang memadai untuk pergerakan pemain.",
    image: "https://images.unsplash.com/photo-1670435972971-36e0b43fd746",
    imageAlt: "Indoor volleyball court with specialized sports vinyl flooring, regulation FIVB net, bright overhead lighting, and spacious player movement zones",
    price: 90000,
    size: "18m x 9m",
    capacity: "12-14 pemain",
    surface: "Vinyl",
    indoor: true,
    amenities: ["Parkir", "Toilet", "Ruang Ganti", "Lampu", "AC"]
  }];


  const mockBookings = [
  {
    id: 1,
    fieldId: 1,
    date: "21/11/2025",
    time: "08:00",
    status: "confirmed",
    userName: "Ahmad Rizki"
  },
  {
    id: 2,
    fieldId: 1,
    date: "21/11/2025",
    time: "10:00",
    status: "pending",
    userName: "Budi Santoso"
  },
  {
    id: 3,
    fieldId: 2,
    date: "21/11/2025",
    time: "14:00",
    status: "confirmed",
    userName: "Citra Dewi"
  },
  {
    id: 4,
    fieldId: 3,
    date: "22/11/2025",
    time: "09:00",
    status: "confirmed",
    userName: "Dedi Kurniawan"
  }];


  useEffect(() => {
    const storedUserName = localStorage.getItem('userName') || 'Pengguna';
    const storedUserRole = localStorage.getItem('userRole') || 'customer';
    setUserName(storedUserName);
    setUserRole(storedUserRole);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      fieldType: 'all',
      priceRange: 'all',
      timeSlot: 'all'
    });
  };

  const getFilteredFields = () => {
    let filtered = [...mockFields];

    if (filters?.searchQuery) {
      filtered = filtered?.filter((field) =>
      field?.name?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) ||
      field?.description?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase())
      );
    }

    if (filters?.fieldType !== 'all') {
      filtered = filtered?.filter((field) => field?.type === filters?.fieldType);
    }

    if (filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.split('-')?.map((v) => v?.replace('+', ''));
      filtered = filtered?.filter((field) => {
        if (max) {
          return field?.price >= parseInt(min) && field?.price <= parseInt(max);
        } else {
          return field?.price >= parseInt(min);
        }
      });
    }

    return filtered;
  };

  const handleViewDetails = (field) => {
    setSelectedField(field);
    setShowDetailModal(true);
  };

  const handleBookSlot = (field, date, time) => {
    setSelectedField(field);
    setBookingSlot({ date, time });
    setShowBookingModal(true);
  };

  const handleBookField = (field) => {
    setSelectedField(field);
    const today = new Date();
    setBookingSlot({ date: today, time: '08:00' });
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingData) => {
    console.log('Booking confirmed:', bookingData);

    if (window.showNotification) {
      window.showNotification({
        type: 'success',
        message: 'Booking berhasil dibuat! Menunggu persetujuan admin.',
        duration: 5000
      });
    }

    setShowBookingModal(false);
    setSelectedField(null);
    setBookingSlot(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/authentication');
  };

  const filteredFields = getFilteredFields();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout} />

      <NotificationSystem />
      <main className="container mx-auto px-4 pt-20 pb-24 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Jadwal Lapangan</h1>
              <p className="text-muted-foreground">
                Lihat ketersediaan lapangan dan buat booking dengan mudah
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => setViewMode('calendar')}>

                Kalender
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                iconName="Grid"
                iconPosition="left"
                onClick={() => setViewMode('list')}>

                Daftar
              </Button>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              fullWidth
              iconName="Calendar"
              iconPosition="left"
              onClick={() => setViewMode('calendar')}>

              Kalender
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              fullWidth
              iconName="Grid"
              iconPosition="left"
              onClick={() => setViewMode('list')}>

              Daftar
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <FieldFilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters} />


        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {filteredFields?.length} dari {mockFields?.length} lapangan
          </p>
        </div>

        {/* Content Area */}
        {viewMode === 'calendar' ?
        <ScheduleCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          fields={filteredFields}
          bookings={mockBookings}
          onBookSlot={handleBookSlot} /> :


        <FieldListView
          fields={filteredFields}
          onViewDetails={handleViewDetails}
          onBookField={handleBookField} />

        }

        {/* Empty State */}
        {filteredFields?.length === 0 &&
        <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tidak ada lapangan ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah filter pencarian Anda
            </p>
            <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleResetFilters}>

              Reset Filter
            </Button>
          </div>
        }
      </main>
      {/* Modals */}
      {showDetailModal && selectedField &&
      <FieldDetailCard
        field={selectedField}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedField(null);
        }}
        onBookNow={(field) => {
          setShowDetailModal(false);
          handleBookField(field);
        }} />

      }
      {showBookingModal && selectedField && bookingSlot &&
      <BookingModal
        field={selectedField}
        selectedDate={bookingSlot?.date}
        selectedTime={bookingSlot?.time}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedField(null);
          setBookingSlot(null);
        }}
        onConfirm={handleConfirmBooking} />

      }
      <BottomNavigation userRole={userRole} />
    </div>);

};

export default FieldSchedule;