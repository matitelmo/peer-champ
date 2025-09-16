// Quick fix for the third interval issue
const fs = require('fs');
const content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');
const fixed = content.replace(
  'currentDate = new Date(currentDate.getTime() + (interval * 7 * 24 * 60 * 60 * 1000));',
  'currentDate = new Date(currentDate.getTime() + ((interval || 1) * 7 * 24 * 60 * 60 * 1000));'
);
fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', fixed);
