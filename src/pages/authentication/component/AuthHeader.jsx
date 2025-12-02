import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthHeader = ({ activeTab }) => {
  const headerContent = {
    login: {
      title: 'Selamat Datang Kembali',
      description: 'Masuk ke akun Anda untuk melanjutkan booking lapangan'
    },
    register: {
      title: 'Buat Akun Baru',
      description: 'Daftar sekarang untuk mulai booking lapangan favorit Anda'
    }
  };

  const content = headerContent?.[activeTab];

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
        <Icon name="Trophy" size={32} color="var(--color-primary)" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">{content?.title}</h1>
      <p className="text-muted-foreground">{content?.description}</p>
    </div>
  );
};

export default AuthHeader;