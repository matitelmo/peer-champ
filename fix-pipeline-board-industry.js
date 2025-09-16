// Fix industry property in PipelineBoard.tsx
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/PipelineBoard.tsx', 'utf8');

// Fix all industry property references
content = content.replace(
  'opportunity.industry',
  'opportunity.prospect_industry'
);

fs.writeFileSync('src/components/opportunity/PipelineBoard.tsx', content);
