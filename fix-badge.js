// Fix Badge variant errors
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Fix the remaining badge variant errors
content = content.replace(
  'variant="error"',
  'variant="destructive"'
);
content = content.replace(
  "variant={selectedSlot.type === 'available' ? 'success' : selectedSlot.type === 'busy' ? 'error' : 'warning'}",
  "variant={selectedSlot.type === 'available' ? 'success' : selectedSlot.type === 'busy' ? 'destructive' : 'warning'}"
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
