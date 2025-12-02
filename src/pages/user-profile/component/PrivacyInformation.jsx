import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrivacyInformation = ({ onDeleteAccount }) => {
  const privacyItems = [
    {
      icon: 'Lock',
      title: 'Data Terenkripsi',
      description: 'Semua data pribadi Anda dienkripsi dengan standar keamanan tinggi'
    },
    {
      icon: 'Eye',
      title: 'Privasi Terjaga',
      description: 'Kami tidak membagikan informasi Anda kepada pihak ketiga tanpa izin'
    },
    {
      icon: 'Shield',
      title: 'Keamanan Terjamin',
      description: 'Sistem kami dilindungi dengan firewall dan monitoring 24/7'
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Privasi & Keamanan Data</h2>
      </div>
      <div className="space-y-4 mb-6">
        {privacyItems?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-background rounded-lg border border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={item?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">{item?.title}</p>
              <p className="text-sm text-muted-foreground">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6">
        <div className="bg-error/10 rounded-lg p-4 border border-error/20 mb-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error mb-1">Zona Berbahaya</p>
              <p className="text-sm text-muted-foreground">
                Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          iconName="Trash2"
          iconPosition="left"
          onClick={onDeleteAccount}
          fullWidth
        >
          Hapus Akun Permanen
        </Button>
      </div>
    </div>
  );
};

export default PrivacyInformation;