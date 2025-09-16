// Fix remaining industry property references
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

// Fix all remaining industry property references
content = content.replace(
  '{opportunity.industry}',
  '{opportunity.prospect_industry}'
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
