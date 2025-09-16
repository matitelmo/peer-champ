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
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
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
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    interval?: number;
    endDate?: Date;
  };
  timezone: string;
  description?: string;
}

interface AvailabilityManagerProps {
  className?: string;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  className = '',
}) => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

  // Form state for creating/editing slots
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    type: 'available' as 'available' | 'busy' | 'exception',
    isRecurring: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    description: '',
  });

  // Recurring pattern form state
  const [recurringData, setRecurringData] = useState({
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    daysOfWeek: [] as number[],
    interval: 1,
    endDate: '',
  });

  // Calendar view state
  const [view, setView] = useState<any>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  // Load existing availability slots
  useEffect(() => {
    loadAvailabilitySlots();
  }, []);

  const loadAvailabilitySlots = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockSlots: AvailabilitySlot[] = [
        {
          id: '1',
          start: new Date(2024, 0, 15, 9, 0), // Monday 9 AM
          end: new Date(2024, 0, 15, 17, 0), // Monday 5 PM
          title: 'Available',
          type: 'available',
          isRecurring: true,
          recurringPattern: {
            frequency: 'weekly',
            daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
            interval: 1,
          },
          timezone: 'America/New_York',
          description: 'Regular business hours',
        },
        {
          id: '2',
          start: new Date(2024, 0, 16, 14, 0), // Tuesday 2 PM
          end: new Date(2024, 0, 16, 15, 0), // Tuesday 3 PM
          title: 'Team Meeting',
          type: 'busy',
          isRecurring: false,
          timezone: 'America/New_York',
          description: 'Weekly team standup',
        },
      ];
      setSlots(mockSlots);
    } catch (err) {
      setError('Failed to load availability slots');
      console.error('Error loading availability slots:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate recurring events for calendar display
  const generateRecurringEvents = (slot: AvailabilitySlot): AvailabilitySlot[] => {
    if (!slot.isRecurring || !slot.recurringPattern) {
      return [slot];
    }

    const events: AvailabilitySlot[] = [];
    const { frequency, daysOfWeek, interval, endDate } = slot.recurringPattern;
    const startDate = new Date(slot.start);
    const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    let currentDate = new Date(startDate);
    let eventCount = 0;
    const maxEvents = 100; // Prevent infinite loops

    while (currentDate <= end && eventCount < maxEvents) {
      if (frequency === 'daily') {
        const eventDate = new Date(currentDate);
        eventDate.setDate(eventDate.getDate() + ((interval || 1) * eventCount));
        
        if (eventDate <= end) {
          events.push({
            ...slot,
            id: `${slot.id}-${eventCount}`,
            start: new Date(eventDate.getTime() + (slot.start.getTime() % (24 * 60 * 60 * 1000))),
            end: new Date(eventDate.getTime() + (slot.end.getTime() % (24 * 60 * 60 * 1000))),
          });
        }
      } else if (frequency === 'weekly' && daysOfWeek) {
        for (const dayOfWeek of daysOfWeek) {
          const eventDate = new Date(currentDate);
          const daysUntilTarget = (dayOfWeek - eventDate.getDay() + 7) % 7;
          eventDate.setDate(eventDate.getDate() + daysUntilTarget + ((interval || 1) * eventCount * 7));
          
          if (eventDate <= end) {
            events.push({
              ...slot,
              id: `${slot.id}-${eventCount}-${dayOfWeek}`,
              start: new Date(eventDate.getTime() + (slot.start.getTime() % (24 * 60 * 60 * 1000))),
              end: new Date(eventDate.getTime() + (slot.end.getTime() % (24 * 60 * 60 * 1000))),
            });
          }
        }
      }
      
      eventCount++;
      currentDate = new Date(currentDate.getTime() + ((interval || 1) * 7 * 24 * 60 * 60 * 1000));
    }

    return events;
  };

  // Generate all events for calendar display
  const allEvents = useMemo(() => {
    return slots.flatMap(slot => generateRecurringEvents(slot));
  }, [slots]);

  // Filter events based on current view date range
  const filteredEvents = useMemo(() => {
    const viewStart = startOfWeek(date);
    const viewEnd = endOfWeek(date);
    
    return allEvents.filter(event => 
      isWithinInterval(event.start, { start: viewStart, end: viewEnd })
    );
  }, [allEvents, date]);

  const handleSelectSlot = (slotInfo: any) => {
    const { start, end } = slotInfo;
    setFormData({
      title: '',
      startDate: format(start, 'yyyy-MM-dd'),
      startTime: format(start, 'HH:mm'),
      endDate: format(end, 'yyyy-MM-dd'),
      endTime: format(end, 'HH:mm'),
      type: 'available',
      isRecurring: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      description: '',
    });
    setEditingSlot(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: AvailabilitySlot) => {
    setSelectedSlot(event);
  };

  const handleSaveSlot = async () => {
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const newSlot: AvailabilitySlot = {
        id: editingSlot?.id || Date.now().toString(),
        start: startDateTime,
        end: endDateTime,
        title: formData.title,
        type: formData.type,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.isRecurring ? {
          frequency: recurringData.frequency,
          daysOfWeek: recurringData.daysOfWeek,
          interval: recurringData.interval,
          endDate: recurringData.endDate ? new Date(recurringData.endDate) : undefined,
        } : undefined,
        timezone: formData.timezone,
        description: formData.description,
      };

      if (editingSlot) {
        // Update existing slot
        setSlots(prev => prev.map(slot => 
          slot.id === editingSlot.id ? newSlot : slot
        ));
      } else {
        // Add new slot
        setSlots(prev => [...prev, newSlot]);
      }

      // Reset form and close modal
      setFormData({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        type: 'available',
        isRecurring: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        description: '',
      });
      setRecurringData({
        frequency: 'weekly',
        daysOfWeek: [],
        interval: 1,
        endDate: '',
      });
      setShowModal(false);
      setEditingSlot(null);
    } catch (err) {
      setError('Failed to save availability slot');
      console.error('Error saving slot:', err);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      setSlots(prev => prev.filter(slot => slot.id !== slotId));
      setShowDeleteModal(false);
      setDeletingSlotId(null);
    } catch (err) {
      setError('Failed to delete availability slot');
      console.error('Error deleting slot:', err);
    }
  };

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
          style: {
            ...baseStyle,
            backgroundColor: '#10B981', // green
          }
        };
      case 'busy':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#EF4444', // red
          }
        };
      case 'exception':
        return {
          style: {
            ...baseStyle,
            backgroundColor: '#F59E0B', // yellow
          }
        };
      default:
        return { style: baseStyle };
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setRecurringData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Availability Manager</h2>
          <p className="text-gray-600">Manage your available times for reference calls</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <PlusIcon size={16} className="mr-2" />
          Add Availability
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon size={20} className="mr-2" />
            Calendar View
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

      {/* Availability Slots List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Availability</CardTitle>
        </CardHeader>
        <CardBody>
          {slots.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No availability set</h3>
              <p className="text-gray-600 mb-4">
                Add your available times to start receiving reference call requests.
              </p>
              <Button onClick={() => setShowModal(true)}>
                <PlusIcon size={16} className="mr-2" />
                Add Availability
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                       <Badge 
                         variant={slot.type === 'available' ? 'success' : slot.type === 'busy' ? 'destructive' : 'warning'}
                       >
                        {slot.type}
                      </Badge>
                      <h4 className="font-medium text-gray-900">{slot.title}</h4>
                      {slot.isRecurring && (
                        <Badge variant="secondary">Recurring</Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <ClockIcon size={16} className="mr-1" />
                          {format(slot.start, 'MMM dd, yyyy HH:mm')} - {format(slot.end, 'HH:mm')}
                        </span>
                        <span>{slot.timezone}</span>
                      </div>
                      {slot.description && (
                        <p className="mt-1">{slot.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingSlot(slot);
                        setFormData({
                          title: slot.title,
                          startDate: format(slot.start, 'yyyy-MM-dd'),
                          startTime: format(slot.start, 'HH:mm'),
                          endDate: format(slot.end, 'yyyy-MM-dd'),
                          endTime: format(slot.end, 'HH:mm'),
                          type: slot.type,
                          isRecurring: slot.isRecurring,
                          timezone: slot.timezone,
                          description: slot.description || '',
                        });
                        if (slot.recurringPattern) {
                          setRecurringData({
                            frequency: slot.recurringPattern.frequency,
                            daysOfWeek: slot.recurringPattern.daysOfWeek || [],
                            interval: slot.recurringPattern.interval || 1,
                            endDate: slot.recurringPattern.endDate ? format(slot.recurringPattern.endDate, 'yyyy-MM-dd') : '',
                          });
                        }
                        setShowModal(true);
                      }}
                    >
                      <SaveIcon size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setDeletingSlotId(slot.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSlot(null);
        }}
        title={editingSlot ? 'Edit Availability' : 'Add Availability'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Available for calls"
            />
            <Select
              label="Type"
              value={formData.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'busy', label: 'Busy' },
                { value: 'exception', label: 'Exception' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <Select
              value={formData.timezone}
              onChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
              options={[
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' },
                { value: 'Europe/London', label: 'London' },
                { value: 'Europe/Paris', label: 'Paris' },
                { value: 'Asia/Tokyo', label: 'Tokyo' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description for this availability slot"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Make this recurring</span>
            </label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Recurring Pattern</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Frequency"
                  value={recurringData.frequency}
                  onChange={(value) => setRecurringData(prev => ({ ...prev, frequency: value as any }))}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <Input
                  label="Interval"
                  type="number"
                  value={recurringData.interval.toString()}
                  onChange={(e) => setRecurringData(prev => ({ ...prev, interval: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                />
              </div>

              {recurringData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={recurringData.daysOfWeek.includes(index)}
                          onChange={() => toggleDayOfWeek(index)}
                          className="mr-1"
                        />
                        <span className="text-xs">{day.substring(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Input
                label="End Date (Optional)"
                type="date"
                value={recurringData.endDate}
                onChange={(e) => setRecurringData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowModal(false);
                setEditingSlot(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSlot}>
              <SaveIcon size={16} className="mr-2" />
              {editingSlot ? 'Update' : 'Save'} Availability
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingSlotId(null);
        }}
        title="Delete Availability"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this availability slot? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingSlotId(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingSlotId && handleDeleteSlot(deletingSlotId)}
            >
              <TrashIcon size={16} className="mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        title="Event Details"
        size="sm"
      >
        {selectedSlot && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">{selectedSlot.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedSlot.description}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <ClockIcon size={16} className="mr-2 text-gray-400" />
                <span>
                  {format(selectedSlot.start, 'MMM dd, yyyy HH:mm')} - {format(selectedSlot.end, 'HH:mm')}
                </span>
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={selectedSlot.type === 'available' ? 'success' : selectedSlot.type === 'busy' ? 'destructive' : 'warning'}
                >
                  {selectedSlot.type}
                </Badge>
                {selectedSlot.isRecurring && (
                  <Badge variant="secondary" className="ml-2">Recurring</Badge>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-gray-500">Timezone: {selectedSlot.timezone}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AvailabilityManager;
