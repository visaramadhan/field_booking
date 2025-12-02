import React from 'react';
import Icon from '../../../components/AppIcon';

const FieldAnalytics = ({ fields }) => {
  const calculateAnalytics = () => {
    const totalFields = fields?.length;
    const activeFields = fields?.filter(f => f?.status === 'active')?.length;
    const maintenanceFields = fields?.filter(f => f?.status === 'maintenance')?.length;
    const closedFields = fields?.filter(f => f?.status === 'closed')?.length;

    const totalRevenue = fields?.reduce((sum, field) => {
      return sum + (field?.bookingStats?.revenue || 0);
    }, 0);

    const avgUtilization = fields?.length > 0
      ? fields?.reduce((sum, field) => sum + (field?.bookingStats?.utilizationRate || 0), 0) / fields?.length
      : 0;

    const totalBookings = fields?.reduce((sum, field) => {
      return sum + (field?.bookingStats?.totalBookings || 0);
    }, 0);

    return {
      totalFields,
      activeFields,
      maintenanceFields,
      closedFields,
      totalRevenue,
      avgUtilization: Math.round(avgUtilization),
      totalBookings
    };
  };

  const analytics = calculateAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const stats = [
    {
      label: 'Total Lapangan',
      value: analytics?.totalFields,
      icon: 'MapPin',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Lapangan Aktif',
      value: analytics?.activeFields,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Maintenance',
      value: analytics?.maintenanceFields,
      icon: 'Wrench',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Tutup',
      value: analytics?.closedFields,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  const performanceStats = [
    {
      label: 'Total Booking',
      value: analytics?.totalBookings,
      icon: 'Calendar',
      color: 'text-primary'
    },
    {
      label: 'Total Pendapatan',
      value: formatCurrency(analytics?.totalRevenue),
      icon: 'DollarSign',
      color: 'text-success'
    },
    {
      label: 'Rata-rata Penggunaan',
      value: `${analytics?.avgUtilization}%`,
      icon: 'TrendingUp',
      color: 'text-primary'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat?.bgColor} p-2 rounded-lg`}>
                <Icon name={stat?.icon} size={20} color={`var(--color-${stat?.color?.replace('text-', '')})`} />
              </div>
              <span className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</span>
            </div>
            <p className="text-sm text-muted-foreground">{stat?.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <span>Performa Lapangan</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceStats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon name={stat?.icon} size={24} color={`var(--color-${stat?.color?.replace('text-', '')})`} />
              </div>
              <p className={`text-2xl font-bold ${stat?.color} mb-1`}>{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldAnalytics;