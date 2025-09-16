// Remove updated_at field from updateOpportunityData call
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

// Remove the updated_at field
content = content.replace(
  '      await updateOpportunityData(opportunity.id, {\n        deal_stage: mapStageToDbValue(destStage.id) as any,\n        updated_at: new Date().toISOString(),\n      });',
  '      await updateOpportunityData(opportunity.id, {\n        deal_stage: mapStageToDbValue(destStage.id) as any,\n      });'
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
