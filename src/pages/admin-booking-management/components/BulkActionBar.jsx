import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ selectedCount, onBulkApprove, onBulkReject, onBulkDelete, onDeselectAll }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center space-x-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="CheckSquare" size={18} color="var(--color-primary)" />
        </div>
        <span className="font-medium text-foreground">
          {selectedCount} booking dipilih
        </span>
      </div>

      <div className="h-6 w-px bg-border"></div>

      <div className="flex items-center space-x-2">
        <Button
          variant="success"
          size="sm"
          iconName="Check"
          onClick={onBulkApprove}
        >
          Setujui Semua
        </Button>

        <Button
          variant="danger"
          size="sm"
          iconName="X"
          onClick={onBulkReject}
        >
          Tolak Semua
        </Button>

        <Button
          variant="destructive"
          size="sm"
          iconName="Trash2"
          onClick={onBulkDelete}
        >
          Hapus
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
        >
          Batal
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;