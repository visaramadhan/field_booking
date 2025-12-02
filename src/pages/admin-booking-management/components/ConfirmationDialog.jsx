import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'warning', isProcessing = false }) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: 'AlertTriangle',
      iconColor: 'var(--color-warning)',
      bgColor: 'bg-warning/10',
      confirmVariant: 'warning'
    },
    danger: {
      icon: 'AlertCircle',
      iconColor: 'var(--color-error)',
      bgColor: 'bg-error/10',
      confirmVariant: 'danger'
    },
    success: {
      icon: 'CheckCircle',
      iconColor: 'var(--color-success)',
      bgColor: 'bg-success/10',
      confirmVariant: 'success'
    }
  };

  const config = typeConfig?.[type] || typeConfig?.warning;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card rounded-lg border border-border shadow-lg max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${config?.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon name={config?.icon} size={24} color={config?.iconColor} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-muted/30 border-t border-border rounded-b-lg">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            Batal
          </Button>
          <Button
            variant={config?.confirmVariant}
            onClick={onConfirm}
            loading={isProcessing}
            disabled={isProcessing}
          >
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;