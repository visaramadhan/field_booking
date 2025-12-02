import React from 'react';
import Icon from '../../../components/AppIcon';

const RevenueTracker = ({ revenueData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100)?.toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={24} color="var(--color-success)" />
          </div>
          <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
            +{calculatePercentage(revenueData?.thisMonth, revenueData?.lastMonth)}%
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Pendapatan</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(revenueData?.total)}</p>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckCircle" size={24} color="var(--color-primary)" />
          </div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            Lunas
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pembayaran Selesai</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(revenueData?.paid)}</p>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={24} color="var(--color-warning)" />
          </div>
          <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">
            Pending
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Menunggu Pembayaran</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(revenueData?.pending)}</p>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={24} color="var(--color-accent)" />
          </div>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
            Bulan Ini
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pendapatan November</p>
          <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(revenueData?.thisMonth)}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracker;