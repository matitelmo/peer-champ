// Manual fix for Alert variant
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Replace the specific Alert line
content = content.replace(
  '        <Alert variant="destructive" className="mb-4">',
  '        <Alert variant="error" className="mb-4">'
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
