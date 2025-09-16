// Fix Button variant to destructive
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Fix the Button variant to destructive (Button supports destructive, not error)
content = content.replace(
  'variant="error"',
  'variant="destructive"'
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
