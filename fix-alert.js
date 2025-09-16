// Fix Alert variant back to error
const fs = require('fs');
let content = fs.readFileSync('src/components/advocate/AvailabilityManager.tsx', 'utf8');

// Fix the Alert variant back to error (Alert supports error, but Badge doesn't)
content = content.replace(
  '<Alert variant="destructive"',
  '<Alert variant="error"'
);

fs.writeFileSync('src/components/advocate/AvailabilityManager.tsx', content);
