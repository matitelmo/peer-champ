// Fix stage mapping in PipelineBoard.tsx
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/PipelineBoard.tsx', 'utf8');

// Add the mapping function before handleDragEnd
const mappingFunction = `
  // Map stage names to database values
  const mapStageToDbValue = (stageName: string) => {
    const mapping: Record<string, string> = {
      'prospecting': 'qualification',
      'qualification': 'qualification', 
      'proposal': 'proposal',
      'negotiation': 'negotiation',
      'closed-won': 'closed_won',
      'closed-lost': 'closed_lost',
    };
    return mapping[stageName.toLowerCase()] || 'qualification';
  };

`;

// Insert the mapping function before the handleDragEnd function
content = content.replace(
  '  const handleDragEnd = (result: DropResult) => {',
  mappingFunction + '  const handleDragEnd = (result: DropResult) => {'
);

// Fix the update call to use the mapping and remove updated_at
content = content.replace(
  '      await updateOpportunityData(opportunity.id, {\n        deal_stage: newStage,\n        updated_at: new Date().toISOString(),\n      });',
  '      await updateOpportunityData(opportunity.id, {\n        deal_stage: mapStageToDbValue(destStage.id) as any,\n      });'
);

fs.writeFileSync('src/components/opportunity/PipelineBoard.tsx', content);
