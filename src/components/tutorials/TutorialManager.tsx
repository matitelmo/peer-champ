/**
 * Tutorial Manager Component
 * 
 * Manages multiple feature tutorials and provides a centralized
 * way to show contextual help and feature introductions.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  LightBulbIcon,
} from '@/components/ui/icons';
import { FeatureIntroduction } from './FeatureIntroduction';
import { usePostSignupStore } from '@/lib/stores/postSignupStore';
import { cn } from '@/lib/utils';

interface TutorialManagerProps {
  className?: string;
  onTutorialComplete?: (tutorialId: string) => void;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'advanced' | 'integration';
  estimatedTime: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  prerequisites?: string[];
}

const availableTutorials: Tutorial[] = [
  {
    id: 'advocate-matching',
    title: 'AI-Powered Advocate Matching',
    description: 'Learn how to find the perfect advocate for your prospects',
    category: 'basic',
    estimatedTime: 3,
    completed: false,
    priority: 'high',
  },
  {
    id: 'reference-scheduling',
    title: 'Reference Call Scheduling',
    description: 'Master the art of seamless reference call coordination',
    category: 'basic',
    estimatedTime: 4,
    completed: false,
    priority: 'high',
  },
  {
    id: 'crm-integration',
    title: 'CRM Integration',
    description: 'Connect your CRM for seamless workflow integration',
    category: 'integration',
    estimatedTime: 5,
    completed: false,
    priority: 'medium',
  },
  {
    id: 'data-import',
    title: 'Data Import & Management',
    description: 'Import and manage your advocate and opportunity data',
    category: 'basic',
    estimatedTime: 4,
    completed: false,
    priority: 'medium',
  },
  {
    id: 'analytics-reporting',
    title: 'Analytics & Reporting',
    description: 'Understand your reference program performance',
    category: 'advanced',
    estimatedTime: 6,
    completed: false,
    priority: 'low',
  },
];

export const TutorialManager: React.FC<TutorialManagerProps> = ({
  className = '',
  onTutorialComplete,
}) => {
  const { completedSteps } = usePostSignupStore();
  const [tutorials, setTutorials] = useState<Tutorial[]>(availableTutorials);
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [showAllTutorials, setShowAllTutorials] = useState(false);

  // Update tutorial completion status based on completed steps
  useEffect(() => {
    setTutorials(prev => prev.map(tutorial => ({
      ...tutorial,
      completed: completedSteps.has(`tutorial_${tutorial.id}`),
    })));
  }, [completedSteps]);

  const handleStartTutorial = (tutorialId: string) => {
    setActiveTutorial(tutorialId);
  };

  const handleTutorialComplete = (tutorialId: string) => {
    setActiveTutorial(null);
    setTutorials(prev => prev.map(tutorial => 
      tutorial.id === tutorialId 
        ? { ...tutorial, completed: true }
        : tutorial
    ));
    onTutorialComplete?.(tutorialId);
  };

  const handleTutorialDismiss = () => {
    setActiveTutorial(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'advanced':
        return 'bg-blue-100 text-blue-800';
      case 'integration':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <StarIcon size={16} className="text-red-500" />;
      case 'medium':
        return <StarIcon size={16} className="text-yellow-500" />;
      case 'low':
        return <StarIcon size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic':
        return <BookOpenIcon size={16} />;
      case 'advanced':
        return <LightBulbIcon size={16} />;
      case 'integration':
        return <PlayIcon size={16} />;
      default:
        return <BookOpenIcon size={16} />;
    }
  };

  const completedTutorials = tutorials.filter(t => t.completed).length;
  const totalTutorials = tutorials.length;
  const progressPercentage = Math.round((completedTutorials / totalTutorials) * 100);

  const displayedTutorials = showAllTutorials ? tutorials : tutorials.slice(0, 3);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Feature Tutorials
          </h2>
          <p className="text-gray-600">
            Learn how to get the most out of PeerChamps
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {completedTutorials}/{totalTutorials}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Progress</span>
          <span className="text-gray-500">{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-amaranth-500 to-sundown-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Tutorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            className={cn(
              'hover:shadow-md transition-shadow cursor-pointer',
              tutorial.completed && 'border-green-200 bg-green-50'
            )}
            onClick={() => !tutorial.completed && handleStartTutorial(tutorial.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    tutorial.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gradient-to-br from-amaranth-500 to-sundown-400 text-white'
                  )}>
                    {tutorial.completed ? (
                      <CheckCircleIcon size={20} />
                    ) : (
                      getCategoryIcon(tutorial.category)
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{tutorial.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getCategoryColor(tutorial.category)}>
                        {tutorial.category}
                      </Badge>
                      {getPriorityIcon(tutorial.priority)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-0">
              <p className="text-sm text-gray-600 mb-4">
                {tutorial.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ClockIcon size={14} />
                  <span>{tutorial.estimatedTime} min</span>
                </div>
                
                {tutorial.completed ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTutorial(tutorial.id);
                    }}
                    rightIcon={<PlayIcon size={14} />}
                  >
                    Start
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Show More/Less Button */}
      {tutorials.length > 3 && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setShowAllTutorials(!showAllTutorials)}
          >
            {showAllTutorials 
              ? `Show Less` 
              : `Show ${tutorials.length - 3} More Tutorials`
            }
          </Button>
        </div>
      )}

      {/* Active Tutorial Modal */}
      {activeTutorial && (
        <FeatureIntroduction
          featureId={activeTutorial}
          onComplete={() => handleTutorialComplete(activeTutorial)}
          onDismiss={handleTutorialDismiss}
          autoStart={true}
        />
      )}
    </div>
  );
};
