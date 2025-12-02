import React from 'react';
import Icon from '../../../components/AppIcon';

const BookingPolicySection = () => {
  const policies = [
    {
      icon: 'Clock',
      title: 'Ketentuan Waktu',
      description: 'Booking minimal 2 jam sebelum waktu main. Toleransi keterlambatan maksimal 15 menit.'
    },
    {
      icon: 'CreditCard',
      title: 'Pembayaran',
      description: 'Pembayaran dilakukan di tempat sebelum memulai permainan. Terima cash dan transfer.'
    },
    {
      icon: 'XCircle',
      title: 'Pembatalan',
      description: 'Pembatalan gratis maksimal 24 jam sebelum waktu booking. Setelah itu dikenakan biaya 50%.'
    },
    {
      icon: 'Shield',
      title: 'Kebijakan Lapangan',
      description: 'Dilarang merokok di area lapangan. Wajib menggunakan sepatu futsal yang sesuai.'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Syarat & Ketentuan</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies?.map((policy, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={policy?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{policy?.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{policy?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Perhatian</p>
            <p className="text-xs text-muted-foreground">
              Dengan melanjutkan booking, Anda menyetujui semua syarat dan ketentuan yang berlaku. Pastikan semua informasi yang Anda berikan sudah benar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicySection;