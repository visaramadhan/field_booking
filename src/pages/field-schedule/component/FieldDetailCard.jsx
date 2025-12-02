import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FieldDetailCard = ({ field, onClose, onBookNow }) => {
  const amenityIcons = {
    'Parkir': 'Car',
    'Toilet': 'Bath',
    'Kantin': 'Coffee',
    'Musholla': 'Home',
    'Ruang Ganti': 'Users',
    'Tribun': 'Users2',
    'Lampu': 'Lightbulb',
    'AC': 'Wind'
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold text-foreground">Detail Lapangan</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth tap-target"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Field Image */}
          <div className="w-full h-64 rounded-lg overflow-hidden mb-6">
            <Image
              src={field?.image}
              alt={field?.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Field Info */}
          <div className="space-y-6">
            {/* Name and Type */}
            <div>
              <h4 className="text-2xl font-bold text-foreground mb-2">{field?.name}</h4>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                <Icon name="MapPin" size={16} />
                <span>{field?.type}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center space-x-2">
                <Icon name="FileText" size={18} color="var(--color-primary)" />
                <span>Deskripsi</span>
              </h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {field?.description}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Info" size={18} color="var(--color-primary)" />
                <span>Spesifikasi</span>
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Maximize" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">Ukuran:</span>
                  <span className="font-medium text-foreground">{field?.size}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">Kapasitas:</span>
                  <span className="font-medium text-foreground">{field?.capacity}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Grid" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">Lantai:</span>
                  <span className="font-medium text-foreground">{field?.surface}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Home" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-muted-foreground">Jenis:</span>
                  <span className="font-medium text-foreground">{field?.indoor ? 'Indoor' : 'Outdoor'}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h5 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="CheckCircle" size={18} color="var(--color-primary)" />
                <span>Fasilitas</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {field?.amenities?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-foreground"
                  >
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon
                        name={amenityIcons?.[amenity] || 'Check'}
                        size={16}
                        color="var(--color-success)"
                      />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Harga per Jam</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {field?.price?.toLocaleString('id-ID')}
                  </p>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => onBookNow(field)}
                >
                  Booking Sekarang
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertCircle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Informasi Penting:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Booking minimal 1 jam sebelum waktu bermain</li>
                    <li>Pembatalan maksimal 2 jam sebelum waktu bermain</li>
                    <li>Harap datang 15 menit sebelum waktu bermain</li>
                    <li>Bawa kartu identitas untuk verifikasi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailCard;