// Final fix for component variants
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Fix Alert variant back to error (Alert supports error)
content = content.replace(
  '<Alert variant="destructive"',
  '<Alert variant="error"'
);

// Fix Button variant to destructive (Button supports destructive)
content = content.replace(
  'variant="error"',
  'variant="destructive"'
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
