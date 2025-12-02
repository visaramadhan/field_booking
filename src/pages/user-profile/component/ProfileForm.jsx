import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProfileForm = ({ formData, errors, onChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Informasi Profil</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          name="fullName"
          placeholder="Masukkan nama lengkap"
          value={formData?.fullName}
          onChange={onChange}
          error={errors?.fullName}
          required
        />

        <Input
          label="Alamat Email"
          type="email"
          name="email"
          placeholder="email@example.com"
          value={formData?.email}
          onChange={onChange}
          error={errors?.email}
          required
          description="Email digunakan untuk login dan notifikasi booking"
        />

        <Input
          label="Nomor Telepon"
          type="tel"
          name="phoneNumber"
          placeholder="08123456789"
          value={formData?.phoneNumber}
          onChange={onChange}
          error={errors?.phoneNumber}
          required
        />

        <Input
          label="Alamat"
          type="text"
          name="address"
          placeholder="Masukkan alamat lengkap"
          value={formData?.address}
          onChange={onChange}
          error={errors?.address}
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            fullWidth
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;