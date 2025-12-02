import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ settings, onSettingChange }) => {
  const securityOptions = [
    {
      id: 'emailNotifications',
      label: 'Notifikasi Email',
      description: 'Terima notifikasi booking melalui email',
      icon: 'Mail',
      checked: settings?.emailNotifications
    },
    {
      id: 'smsNotifications',
      label: 'Notifikasi SMS',
      description: 'Terima notifikasi booking melalui SMS',
      icon: 'MessageSquare',
      checked: settings?.smsNotifications
    },
    {
      id: 'bookingReminders',
      label: 'Pengingat Booking',
      description: 'Terima pengingat 24 jam sebelum booking',
      icon: 'Bell',
      checked: settings?.bookingReminders
    },
    {
      id: 'promotionalEmails',
      label: 'Email Promosi',
      description: 'Terima informasi promo dan penawaran khusus',
      icon: 'Tag',
      checked: settings?.promotionalEmails
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} color="var(--color-success)" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Pengaturan Keamanan & Notifikasi</h2>
      </div>
      <div className="space-y-4">
        {securityOptions?.map((option) => (
          <div key={option?.id} className="flex items-start space-x-3 p-4 bg-background rounded-lg border border-border">
            <div className={`w-10 h-10 ${option?.checked ? 'bg-primary/10' : 'bg-muted'} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon name={option?.icon} size={20} color={option?.checked ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} />
            </div>
            <div className="flex-1">
              <Checkbox
                label={option?.label}
                description={option?.description}
                checked={option?.checked}
                onChange={(e) => onSettingChange(option?.id, e?.target?.checked)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning mb-1">Informasi Keamanan</p>
            <p className="text-sm text-muted-foreground">
              Jangan pernah membagikan password Anda kepada siapapun. Tim kami tidak akan pernah meminta password Anda melalui email atau telepon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;