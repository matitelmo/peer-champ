// Fix updateOpportunity to updateOpportunityData
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

// Fix the function call
content = content.replace(
  'await updateOpportunity(opportunity.id, {',
  'await updateOpportunityData(opportunity.id, {'
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
