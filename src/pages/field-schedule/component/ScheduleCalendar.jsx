import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleCalendar = ({ selectedDate, onDateChange, fields, bookings, onBookSlot, businessSettings }) => {
  const [viewMode, setViewMode] = useState('week');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const generateSlotsForDate = (date) => {
    const day = date?.getDay();
    const isWeekend = day === 0 || day === 6;
    const hours = isWeekend ? (businessSettings?.weekendHours || { start:'06:00', end:'24:00' }) : (businessSettings?.weekdayHours || { start:'08:00', end:'22:00' });
    const [startH, startM] = (hours?.start || '08:00')?.split(':')?.map(Number);
    const [endH, endM] = (hours?.end || '22:00')?.split(':')?.map(Number);
    const slots = [];
    for (let h = startH; h <= endH; h++) {
      const hh = String(h)?.padStart(2,'0');
      slots.push(`${hh}:00`);
    }
    return slots;
  };

  const getWeekSlots = () => {
    const dates = getWeekDates();
    const hoursForDay = (date) => {
      const day = date?.getDay();
      const isWeekend = day === 0 || day === 6;
      return isWeekend ? (businessSettings?.weekendHours || { start:'06:00', end:'24:00' }) : (businessSettings?.weekdayHours || { start:'08:00', end:'22:00' });
    };
    let minStart = 24, maxEnd = 0;
    dates?.forEach(d => {
      const h = hoursForDay(d);
      const [sH] = (h?.start || '08:00')?.split(':')?.map(Number);
      const [eH] = (h?.end || '22:00')?.split(':')?.map(Number);
      minStart = Math.min(minStart, sH);
      maxEnd = Math.max(maxEnd, eH);
    });
    const slots = [];
    for (let h = minStart; h <= maxEnd; h++) {
      slots.push(`${String(h)?.padStart(2,'0')}:00`);
    }
    return slots;
  };

  useEffect(() => {
    const today = new Date();
    today?.setHours(0, 0, 0, 0);
    setCurrentWeekStart(today);
  }, []);

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date?.setDate(start?.getDate() + i);
      dates?.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart?.setDate(currentWeekStart?.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  const isSlotBooked = (fieldId, date, time) => {
    const slotHour = parseInt((time || '00:00')?.split(':')?.[0] || '0', 10);
    const dateStr = formatDate(date);
    return bookings?.some((booking) => {
      if (booking?.fieldId !== fieldId) return false;
      if (booking?.date !== dateStr) return false;
      const statusOk = booking?.status === 'confirmed' || booking?.status === 'pending';
      if (!statusOk) return false;
      const [startH] = String(booking?.startTime || booking?.time || '00:00')?.split(':')?.map(Number);
      const [endHFromEnd] = String(booking?.endTime || '')?.split(':')?.map(Number);
      const duration = Number(booking?.duration || 1);
      const endH = Number.isFinite(endHFromEnd) && endHFromEnd > startH ? endHFromEnd : (Number.isFinite(duration) ? startH + duration : startH + 1);
      return slotHour >= startH && slotHour < endH;
    });
  };

  const formatDate = (date) => {
    const day = String(date?.getDate())?.padStart(2, '0');
    const month = String(date?.getMonth() + 1)?.padStart(2, '0');
    const year = date?.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days?.[date?.getDay()];
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isPastSlot = (date, time) => {
    const now = new Date();
    const slotDate = new Date(date);
    const [hours, minutes] = time?.split(':');
    slotDate?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return slotDate < now;
  };

  const isHoliday = (date) => {
    const iso = date?.toISOString()?.split('T')?.[0];
    return (businessSettings?.holidays || [])?.includes(iso);
  };

  const isWithinBusinessHours = (date, time) => {
    const day = date?.getDay();
    const isWeekend = day === 0 || day === 6;
    const hours = isWeekend ? (businessSettings?.weekendHours || { start:'06:00', end:'24:00' }) : (businessSettings?.weekdayHours || { start:'08:00', end:'22:00' });
    const [tH] = (time || '00:00')?.split(':')?.map(Number);
    const [sH] = (hours?.start || '08:00')?.split(':')?.map(Number);
    const [eH] = (hours?.end || '22:00')?.split(':')?.map(Number);
    return tH >= sH && tH <= eH;
  };
  const isMaintenanceSlot = (field, date, time) => {
    const iso = date?.toISOString()?.split('T')?.[0];
    const [tH] = (time || '00:00')?.split(':')?.map(Number);
    const periods = field?.maintenancePeriods || [];
    return periods?.some((p) => {
      if (p?.date !== iso) return false;
      const [sH] = String(p?.start || '00:00')?.split(':')?.map(Number);
      const [eH] = String(p?.end || '00:00')?.split(':')?.map(Number);
      return tH >= sH && tH < eH;
    });
  };

  const weekDates = getWeekDates();

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={24} color="var(--color-primary)" />
            <h2 className="text-xl font-semibold text-foreground">Jadwal Lapangan</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Minggu
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Hari
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            iconPosition="left"
            onClick={() => navigateWeek('prev')}
          >
            Minggu Sebelumnya
          </Button>
          <span className="text-sm font-medium text-foreground">
            {formatDate(weekDates?.[0])} - {formatDate(weekDates?.[6])}
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            onClick={() => navigateWeek('next')}
          >
            Minggu Berikutnya
          </Button>
        </div>
      </div>
      {/* Per-Field Calendar Tables */}
      <div className="space-y-8">
        {fields?.map((field) => {
          const firstAvailable = (() => {
            for (const date of weekDates) {
              for (const time of getWeekSlots()) {
                const holiday = isHoliday(date);
                const active = isWithinBusinessHours(date, time) && !holiday;
                const booked = isSlotBooked(field?.id, date, time);
                const past = isPastSlot(date, time);
                const inactive = field?.status !== 'active';
                if (active && !booked && !past && !inactive) {
                  return { date, time };
                }
              }
            }
            return null;
          })();
          return (
            <div key={field?.id} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={18} color="var(--color-primary)" />
                  <span className="font-semibold text-foreground">{field?.name}</span>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Calendar"
                  iconPosition="left"
                  disabled={!firstAvailable}
                  onClick={()=>{
                    if (firstAvailable) onBookSlot(field, firstAvailable?.date, firstAvailable?.time);
                  }}
                >
                  Buat Booking
                </Button>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-8 border-b border-border bg-muted/30">
                    <div className="p-3 text-sm font-medium text-muted-foreground">Waktu</div>
                    {weekDates?.map((date, index) => (
                      <div key={index} className={`p-3 text-center ${isToday(date) ? 'bg-primary/10' : ''}`}>
                        <div className="text-xs text-muted-foreground">{formatDayName(date)}</div>
                        <div className={`text-sm font-semibold ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>{date?.getDate()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-border">
                    {getWeekSlots()?.map((time) => (
                      <div key={time} className="grid grid-cols-8">
                        <div className="p-3 text-sm font-medium text-muted-foreground border-r border-border">{time}</div>
                        {weekDates?.map((date, dateIndex) => {
                          const holiday = isHoliday(date);
                          const activeSlot = isWithinBusinessHours(date, time) && !holiday;
                          const isBooked = isSlotBooked(field?.id, date, time);
                          const isPast = isPastSlot(date, time);
                          const isMaintenance = field?.status === 'maintenance' || isMaintenanceSlot(field, date, time);
                          const clickable = activeSlot && !isBooked && !isPast && field?.status === 'active';
                          const cellClass = isMaintenance
                            ? 'bg-error/10 text-error'
                            : isBooked
                            ? 'bg-success/10 text-success'
                            : !activeSlot
                            ? 'bg-muted text-muted-foreground'
                            : isPast
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-background hover:bg-success/10';
                          const label = isMaintenance
                            ? 'Maintenance'
                            : isBooked
                            ? 'Terisi'
                            : !activeSlot
                            ? (holiday ? 'Libur' : 'Di luar jam buka')
                            : isPast
                            ? 'Lewat'
                            : 'Kosong';
                          return (
                            <div key={dateIndex} className="p-2 border-r border-border">
                              <div
                                className={`p-2 rounded text-xs ${cellClass} ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                                onClick={() => { if (clickable) onBookSlot(field, date, time); }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{label}</span>
                                  {field?.status === 'active' && !isBooked && activeSlot && !isPast && (
                                    <span className="text-[10px] font-semibold">Rp {Number(field?.pricePerHour || field?.price)?.toLocaleString('id-ID')}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-success/10 border border-success rounded"></div>
            <span className="text-muted-foreground">Tersedia</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error/10 border border-error rounded"></div>
            <span className="text-muted-foreground">Terisi</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted border border-border rounded"></div>
            <span className="text-muted-foreground">Lewat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
