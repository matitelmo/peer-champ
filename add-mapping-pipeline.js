// Add the stage mapping function to PipelineBoard.tsx
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
  '  const handleDragEnd = async (event: DragEndEvent) => {',
  mappingFunction + '  const handleDragEnd = async (event: DragEndEvent) => {'
);

fs.writeFileSync('src/components/opportunity/PipelineBoard.tsx', content);
