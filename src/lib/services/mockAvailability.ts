import type { TimeSlot } from '@/components/booking/AvailabilityCalendar';

export const getMockSlots = (days = 3): TimeSlot[] => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const slots: TimeSlot[] = [];
  for (let d = 0; d < days; d += 1) {
    for (const hour of [9, 11, 14, 16]) {
      const start = new Date(now);
      start.setDate(now.getDate() + d);
      start.setHours(hour);
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 45);
      slots.push({ start: start.toISOString(), end: end.toISOString() });
    }
  }
  return slots;
};


