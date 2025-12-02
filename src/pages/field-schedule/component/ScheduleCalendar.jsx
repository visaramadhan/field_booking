import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleCalendar = ({ selectedDate, onDateChange, fields, bookings, onBookSlot }) => {
  const [viewMode, setViewMode] = useState('week');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

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
    return bookings?.some(booking => 
      booking?.fieldId === fieldId &&
      booking?.date === formatDate(date) &&
      booking?.time === time &&
      (booking?.status === 'confirmed' || booking?.status === 'pending')
    );
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
      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-border bg-muted/50">
            <div className="p-3 text-sm font-medium text-muted-foreground">
              Waktu
            </div>
            {weekDates?.map((date, index) => (
              <div
                key={index}
                className={`p-3 text-center ${
                  isToday(date) ? 'bg-primary/10' : ''
                }`}
              >
                <div className="text-xs text-muted-foreground">
                  {formatDayName(date)}
                </div>
                <div className={`text-sm font-semibold ${
                  isToday(date) ? 'text-primary' : 'text-foreground'
                }`}>
                  {date?.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="divide-y divide-border">
            {timeSlots?.map((time) => (
              <div key={time} className="grid grid-cols-8">
                <div className="p-3 text-sm font-medium text-muted-foreground border-r border-border">
                  {time}
                </div>
                {weekDates?.map((date, dateIndex) => (
                  <div
                    key={dateIndex}
                    className="p-2 border-r border-border hover:bg-muted/50 transition-smooth"
                  >
                    <div className="space-y-1">
                      {fields?.map((field) => {
                        const isBooked = isSlotBooked(field?.id, date, time);
                        const isPast = isPastSlot(date, time);
                        
                        return (
                          <div
                            key={field?.id}
                            className={`p-2 rounded text-xs ${
                              isPast
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : isBooked
                                ? 'bg-error/10 text-error' :'bg-success/10 text-success cursor-pointer hover:bg-success/20'
                            }`}
                            onClick={() => {
                              if (!isBooked && !isPast) {
                                onBookSlot(field, date, time);
                              }
                            }}
                          >
                            <div className="font-medium truncate">{field?.name}</div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px]">
                                {isBooked ? 'Terisi' : isPast ? 'Lewat' : 'Tersedia'}
                              </span>
                              {!isBooked && !isPast && (
                                <span className="text-[10px] font-semibold">
                                  Rp {field?.price?.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
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