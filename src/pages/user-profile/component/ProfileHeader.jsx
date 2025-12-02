import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ userName, userEmail, profileImage, profileImageAlt, onImageUpload, isUploading }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
            <Image
              src={profileImage}
              alt={profileImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-smooth tap-target">
            <Icon name="Camera" size={16} color="var(--color-primary-foreground)" />
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-foreground mb-1">{userName}</h1>
          <p className="text-muted-foreground mb-3">{userEmail}</p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <div className="inline-flex items-center space-x-2 bg-success/10 px-3 py-1.5 rounded-lg">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">Akun Aktif</span>
            </div>
            <div className="inline-flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-lg">
              <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
              <span className="text-sm text-muted-foreground">Bergabung Nov 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;