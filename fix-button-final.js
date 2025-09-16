// Fix Button variant to destructive
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Fix the Button variant to destructive
content = content.replace(
  '              variant="error"',
  '              variant="destructive"'
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
