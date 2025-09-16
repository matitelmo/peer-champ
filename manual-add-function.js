// Manually add the mapping function
const fs = require('fs');
let content = fs.readFileSync('src/components/opportunity/OpportunityPipeline.tsx', 'utf8');

// Find the line before handleDragEnd and add the function
const functionToAdd = `
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

// Insert before the handleDragEnd function
content = content.replace(
  '  const handleDragEnd = async (result: DropResult) => {',
  functionToAdd + '  const handleDragEnd = async (result: DropResult) => {'
);

fs.writeFileSync('src/components/opportunity/OpportunityPipeline.tsx', content);
