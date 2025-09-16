/**
 * Availability Manager Component
 * 
 * Comprehensive availability management system for advocates with calendar integration,
 * recurring availability patterns, and time zone handling.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { format, parseISO, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useAuth } from '@/hooks/useAuth';
import { Button, Card, CardHeader, CardTitle, CardBody, Input, Select, Badge, Alert, Modal } from '@/components/ui';
import { CalendarIcon, ClockIcon, PlusIcon, TrashIcon, SaveIcon, SettingsIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// Configure moment for react-big-calendar
moment.locale('en');
const localizer = momentLocalizer(moment);

interface AvailabilitySlot {
  id: string;
  start: Date;
  end: Date;
  title: string;
  type: 'available' | 'busy' | 'exception';
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };
  bufferTime?: number; // minutes
  timezone: string;
}

interface AvailabilityManagerProps {
  advocateId?: string;
  onSave?: (slots: AvailabilitySlot[]) => void;
  className?: string;
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

const RECURRING_PATTERNS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  advocateId,
  onSave,
  className = '',
}) => {
  const { user } = useAuth();
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state for adding/editing availability
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'available' as 'available' | 'busy' | 'exception',
    bufferTime: 15,
    isRecurring: false,
    recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly',
    recurringInterval: 1,
    selectedDays: [] as number[],
    endDate: '',
  });

  // Calendar view state
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  // Load existing availability slots
  useEffect(() => {
    loadAvailabilitySlots();
  }, [advocateId]);

  const loadAvailabilitySlots = async () => {
    // TODO: Implement API call to load existing availability
    // For now, using mock data
    const mockSlots: AvailabilitySlot[] = [
      {
        id: '1',
        start: new Date(2024, 11, 23, 9, 0), // Dec 23, 2024, 9:00 AM
        end: new Date(2024, 11, 23, 17, 0), // Dec 23, 2024, 5:00 PM
        title: 'Available',
        type: 'available',
        timezone: selectedTimezone,
        bufferTime: 15,
      },
    ];
    setAvailabilitySlots(mockSlots);
  };

  const handleAddAvailability = () => {
    setFormData({
      startTime: '',
      endTime: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'available',
      bufferTime: 15,
      isRecurring: false,
      recurringPattern: 'weekly',
      recurringInterval: 1,
      selectedDays: [],
      endDate: '',
    });
    setEditingSlot(null);
    setShowAddModal(true);
  };

  const handleEditAvailability = (slot: AvailabilitySlot) => {
    setFormData({
      startTime: format(slot.start, 'HH:mm'),
      endTime: format(slot.end, 'HH:mm'),
      date: format(slot.start, 'yyyy-MM-dd'),
      type: slot.type,
      bufferTime: slot.bufferTime || 15,
      isRecurring: !!slot.recurring,
      recurringPattern: slot.recurring?.pattern || 'weekly',
      recurringInterval: slot.recurring?.interval || 1,
      selectedDays: slot.recurring?.daysOfWeek || [],
      endDate: slot.recurring?.endDate ? format(slot.recurring.endDate, 'yyyy-MM-dd') : '',
    });
    setEditingSlot(slot);
    setShowAddModal(true);
  };

  const handleSaveAvailability = () => {
    const newSlots: AvailabilitySlot[] = [];

    if (formData.isRecurring) {
      // Generate recurring slots
      const startDate = parseISO(`${formData.date}T${formData.startTime}`);
      const endDate = parseISO(`${formData.date}T${formData.endTime}`);
      const recurringEndDate = formData.endDate ? parseISO(formData.endDate) : addDays(new Date(), 90);

      // Generate slots based on pattern
      let currentDate = startDate;
      while (currentDate <= recurringEndDate) {
        if (formData.recurringPattern === 'weekly' && formData.selectedDays.includes(currentDate.getDay())) {
          newSlots.push({
            id: `${Date.now()}-${currentDate.getTime()}`,
            start: currentDate,
            end: new Date(currentDate.getTime() + (endDate.getTime() - startDate.getTime())),
            title: formData.type === 'available' ? 'Available' : formData.type === 'busy' ? 'Busy' : 'Exception',
            type: formData.type,
            timezone: selectedTimezone,
            bufferTime: formData.bufferTime,
            recurring: {
              pattern: formData.recurringPattern,
              interval: formData.recurringInterval,
              daysOfWeek: formData.selectedDays,
              endDate: recurringEndDate,
            },
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    } else {
      // Single slot
      const startDateTime = parseISO(`${formData.date}T${formData.startTime}`);
      const endDateTime = parseISO(`${formData.date}T${formData.endTime}`);

      newSlots.push({
        id: editingSlot?.id || `${Date.now()}`,
        start: startDateTime,
        end: endDateTime,
        title: formData.type === 'available' ? 'Available' : formData.type === 'busy' ? 'Busy' : 'Exception',
        type: formData.type,
        timezone: selectedTimezone,
        bufferTime: formData.bufferTime,
      });
    }

    if (editingSlot) {
      // Update existing slot
      setAvailabilitySlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? newSlots[0] : slot
      ));
    } else {
      // Add new slots
      setAvailabilitySlots(prev => [...prev, ...newSlots]);
    }

    setShowAddModal(false);
    onSave?.(newSlots);
  };

  const handleDeleteAvailability = (slotId: string) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  // Calendar event handlers
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setFormData(prev => ({
      ...prev,
      date: format(start, 'yyyy-MM-dd'),
      startTime: format(start, 'HH:mm'),
      endTime: format(end, 'HH:mm'),
    }));
    setEditingSlot(null);
    setShowAddModal(true);
  };

  const handleSelectEvent = (event: AvailabilitySlot) => {
    handleEditAvailability(event);
  };

  // Calendar event styling
  const eventStyleGetter = (event: AvailabilitySlot) => {
    const baseStyle = {
      borderRadius: '4px',
      border: 'none',
      color: 'white',
      padding: '2px 8px',
      fontSize: '12px',
    };

    switch (event.type) {
      case 'available':
        return {
          ...baseStyle,
          backgroundColor: '#10B981', // green
        };
      case 'busy':
        return {
          ...baseStyle,
          backgroundColor: '#EF4444', // red
        };
      case 'exception':
        return {
          ...baseStyle,
          backgroundColor: '#F59E0B', // yellow
        };
      default:
        return baseStyle;
    }
  };

  // Filter events for current view
  const filteredEvents = useMemo(() => {
    return availabilitySlots.filter(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;
      
      if (view === Views.WEEK) {
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);
        return isWithinInterval(slotStart, { start: weekStart, end: weekEnd });
      }
      
      return true;
    });
  }, [availabilitySlots, view, date]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Availability Management</h2>
          <p className="text-gray-600">Set your availability and manage your schedule</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedTimezone}
            onChange={(value) => setSelectedTimezone(value)}
            options={TIMEZONE_OPTIONS}
            placeholder="Select timezone"
          />
          <Button onClick={handleAddAvailability} leftIcon={<PlusIcon size={16} />}>
            Add Availability
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon size={20} />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="h-96">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              date={date}
              onView={setView}
              onNavigate={setDate}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              eventPropGetter={eventStyleGetter}
              step={15}
              timeslots={4}
              min={new Date(2024, 0, 1, 6, 0)} // 6 AM
              max={new Date(2024, 0, 1, 22, 0)} // 10 PM
            />
          </div>
        </CardBody>
      </Card>

      {/* Legend */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Busy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm text-gray-600">Exception</span>
        </div>
      </div>

      {/* Add/Edit Availability Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingSlot ? 'Edit Availability' : 'Add Availability'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <Select
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                options={[
                  { value: 'available', label: 'Available' },
                  { value: 'busy', label: 'Busy' },
                  { value: 'exception', label: 'Exception' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buffer Time (minutes)
            </label>
            <Input
              type="number"
              value={formData.bufferTime}
              onChange={(e) => setFormData(prev => ({ ...prev, bufferTime: parseInt(e.target.value) }))}
              min="0"
              max="60"
            />
          </div>

          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                Make this recurring
              </label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern
                    </label>
                    <Select
                      value={formData.recurringPattern}
                      onChange={(value) => setFormData(prev => ({ ...prev, recurringPattern: value as any }))}
                      options={RECURRING_PATTERNS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {formData.recurringPattern === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <label key={day.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.selectedDays.includes(day.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedDays: [...prev.selectedDays, day.value],
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  selectedDays: prev.selectedDays.filter(d => d !== day.value),
                                }));
                              }
                            }}
                            className="mr-1"
                          />
                          <span className="text-sm">{day.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAvailability} leftIcon={<SaveIcon size={16} />}>
              {editingSlot ? 'Update' : 'Add'} Availability
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilityManager;
