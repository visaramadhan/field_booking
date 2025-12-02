import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, fieldName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} color="var(--color-error)" />
          </div>

          <h3 className="text-xl font-semibold text-foreground text-center mb-2">
            Hapus Lapangan?
          </h3>
          
          <p className="text-muted-foreground text-center mb-6">
            Anda yakin ingin menghapus lapangan <span className="font-semibold text-foreground">{fieldName}</span>? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus.
          </p>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              loading={isDeleting}
              iconName="Trash2"
              iconPosition="left"
              className="flex-1"
            >
              Hapus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;