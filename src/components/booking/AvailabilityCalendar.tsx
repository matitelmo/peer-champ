'use client';

import React, { useMemo, useState } from 'react';

export interface TimeSlot {
  start: string; // ISO
  end: string; // ISO
}

interface AvailabilityCalendarProps {
  slots: TimeSlot[];
  timeZone?: string;
  onSelect: (slot: TimeSlot) => void;
}

function formatTime(iso: string, tz?: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  });
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  slots,
  timeZone,
  onSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const byDay: Record<string, TimeSlot[]> = {};
    for (const s of slots) {
      const key = new Date(s.start).toDateString();
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(s);
    }
    return Object.entries(byDay);
  }, [slots]);

  if (slots.length === 0) {
    return (
      <div className="text-gray-600">No available time slots. Please check back later.</div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([day, list], dayIdx) => (
        <div key={day} className="border rounded-lg p-4">
          <div className="font-medium mb-2">{day}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {list.map((slot, idx) => {
              const index = `${dayIdx}-${idx}`;
              const isSelected = selectedIndex === idx && dayIdx === 0; // simple selection handling
              return (
                <button
                  key={index}
                  className={`border rounded px-3 py-2 text-sm text-left hover:border-primary-500 ${
                    isSelected ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedIndex(idx);
                    onSelect(slot);
                  }}
                >
                  <div className="text-gray-900">
                    {formatTime(slot.start, timeZone)} - {formatTime(slot.end, timeZone)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityCalendar;


