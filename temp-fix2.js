// Quick fix for the second interval issue
const fs = require('fs');
const content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');
const fixed = content.replace(
  'eventDate.setDate(eventDate.getDate() + daysUntilTarget + (interval * eventCount * 7));',
  'eventDate.setDate(eventDate.getDate() + daysUntilTarget + ((interval || 1) * eventCount * 7));'
);
fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', fixed);
