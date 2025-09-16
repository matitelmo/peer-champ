// Fix updateOpportunity in PipelineBoard.tsx
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/PipelineBoard.tsx', 'utf8');

// Fix the hook destructuring
content = content.replace(
  'const { opportunities, updateOpportunity, loading, error } = useOpportunities();',
  'const { opportunities, updateOpportunityData, loading, error } = useOpportunities();'
);

// Fix any usage of updateOpportunity
content = content.replace(
  'updateOpportunity(',
  'updateOpportunityData('
);

fs.writeFileSync('src/components/opportunity/PipelineBoard.tsx', content);
