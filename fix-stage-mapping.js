// Fix stage mapping in OpportunityPipeline
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

// Add stage mapping function and fix the update call
const stageMappingCode = `
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
  stageMappingCode + '  const handleDragEnd = (result: DropResult) => {'
);

// Fix the update call to use the mapping
content = content.replace(
    '        deal_stage: newStage,',
    '        deal_stage: mapStageToDbValue(destStage.id) as any,'
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
