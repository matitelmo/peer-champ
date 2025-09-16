// Add the stage mapping function
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

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

  const handleDragEnd = (result: DropResult) => {`;

content = content.replace(
  '  const handleDragEnd = (result: DropResult) => {',
  mappingFunction
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
