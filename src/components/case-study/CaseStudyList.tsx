/**
 * Case Study List Component
 *
 * Component for displaying and managing case studies for advocates.
 * Shows case studies in a grid/list format with filtering and actions.
 */

import React, { useState } from 'react';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { 
  FileTextIcon, 
  EyeIcon, 
  DownloadIcon, 
  EditIcon, 
  TrashIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon
} from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface CaseStudyListProps {
  advocateId?: string;
  onEdit?: (caseStudyId: string) => void;
  onView?: (caseStudyId: string) => void;
  onCreate?: () => void;
  className?: string;
}

export const CaseStudyList: React.FC<CaseStudyListProps> = ({
  advocateId,
  onEdit,
  onView,
  onCreate,
  className = '',
}) => {
  const { 
    caseStudies, 
    loading, 
    error, 
    deleteCaseStudyData, 
    deleting,
    trackView,
    trackDownload,
    fetchCaseStudies
  } = useCaseStudies({ advocateId });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filter case studies
  const filteredCaseStudies = caseStudies.filter(caseStudy => {
    const matchesSearch = !searchTerm || 
      caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseStudy.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || caseStudy.category === categoryFilter;
    const matchesStatus = !statusFilter || caseStudy.approval_status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleView = async (caseStudyId: string) => {
    await trackView(caseStudyId);
    onView?.(caseStudyId);
  };

  const handleDownload = async (caseStudyId: string, fileUrl: string) => {
    await trackDownload(caseStudyId);
    window.open(fileUrl, '_blank');
  };

  const handleDelete = async (caseStudyId: string) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      try {
        await deleteCaseStudyData(caseStudyId);
      } catch (err) {
        console.error('Error deleting case study:', err);
      }
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'success_story':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'case_study':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'testimonial':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'documentation':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'presentation':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => fetchCaseStudies()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Case Studies
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredCaseStudies.length} case study{filteredCaseStudies.length !== 1 ? 'ies' : ''}
          </p>
        </div>
        {onCreate && (
          <Button onClick={onCreate} leftIcon={<PlusIcon size={16} />}>
            Add Case Study
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search case studies..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="success_story">Success Story</option>
            <option value="case_study">Case Study</option>
            <option value="testimonial">Testimonial</option>
            <option value="documentation">Documentation</option>
            <option value="presentation">Presentation</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Case Studies Grid */}
      {filteredCaseStudies.length === 0 ? (
        <div className="text-center py-12">
          <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No case studies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || categoryFilter || statusFilter
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by adding your first case study.'}
          </p>
          {onCreate && (
            <Button onClick={onCreate} leftIcon={<PlusIcon size={16} />}>
              Add Case Study
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaseStudies.map((caseStudy) => (
            <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {caseStudy.title}
                    </CardTitle>
                    {caseStudy.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {caseStudy.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {caseStudy.is_featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Featured
                      </span>
                    )}
                    {caseStudy.is_public && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Public
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getCategoryBadgeVariant(caseStudy.category)
                  )}>
                    {caseStudy.category.replace('_', ' ')}
                  </span>
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getStatusBadgeVariant(caseStudy.approval_status)
                  )}>
                    {caseStudy.approval_status}
                  </span>
                </div>

                {/* Tags */}
                {caseStudy.tags && caseStudy.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {caseStudy.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {caseStudy.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{caseStudy.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* File Info */}
                {caseStudy.file_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <FileTextIcon size={16} />
                    <span className="truncate">{caseStudy.file_name}</span>
                    {caseStudy.file_size && (
                      <span className="text-xs">
                        ({formatFileSize(caseStudy.file_size)})
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <EyeIcon size={16} />
                    <span>{caseStudy.view_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DownloadIcon size={16} />
                    <span>{caseStudy.download_count}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleView(caseStudy.id)}
                    className="flex-1"
                  >
                    <EyeIcon size={16} className="mr-1" />
                    View
                  </Button>
                  {caseStudy.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(caseStudy.id, caseStudy.file_url!)}
                    >
                      <DownloadIcon size={16} />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(caseStudy.id)}
                    >
                      <EditIcon size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(caseStudy.id)}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
