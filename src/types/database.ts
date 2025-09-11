/**
 * Database Types for PeerChamps Application
 *
 * This file contains TypeScript type definitions for all database entities.
 * These types ensure type safety throughout the application and match the
 * database schema defined in the Supabase migrations.
 */

// Base types for common patterns
export type DatabaseTimestamp = string; // ISO timestamp string
export type DatabaseUUID = string;

// Enums and Union Types
export type UserRole = 'sales_rep' | 'advocate' | 'admin';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';
export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';
export type GeographicRegion = string; // Flexible string for now
export type AdvocateStatus = 'active' | 'inactive' | 'pending' | 'blacklisted';
export type RewardType =
  | 'gift_card'
  | 'donation'
  | 'company_swag'
  | 'cash'
  | 'none';
export type DealStage =
  | 'discovery'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';
export type ReferenceRequestStatus =
  | 'not_requested'
  | 'requested'
  | 'in_progress'
  | 'completed'
  | 'declined';
export type ReferenceUrgency = 'low' | 'medium' | 'high' | 'urgent';
export type ReferenceTypeNeeded =
  | 'general'
  | 'technical'
  | 'executive'
  | 'peer_to_peer'
  | 'roi_focused';
export type CrmType = 'salesforce' | 'hubspot' | 'pipedrive' | 'other';
export type CallStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';
export type MeetingPlatform =
  | 'zoom'
  | 'teams'
  | 'meet'
  | 'webex'
  | 'phone'
  | 'other';
export type CallOutcome = 'positive' | 'neutral' | 'negative' | 'no_outcome';
export type DealImpact =
  | 'accelerated'
  | 'neutral'
  | 'delayed'
  | 'lost'
  | 'unknown';
export type ReferenceStrength = 'strong' | 'moderate' | 'weak' | 'negative';
export type RewardStatus =
  | 'pending'
  | 'approved'
  | 'sent'
  | 'received'
  | 'declined';

// Company Entity
export interface Company {
  id: DatabaseUUID;
  name: string;
  domain: string | null;
  subscription_tier: SubscriptionTier;
  settings: Record<string, unknown>;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// User Entity (Application Users)
export interface User {
  id: DatabaseUUID;
  company_id: DatabaseUUID;
  email: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  profile: Record<string, unknown>;
  is_active: boolean;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// Advocate Entity
export interface Advocate {
  id: DatabaseUUID;
  user_id: DatabaseUUID | null; // Link to Supabase auth user
  company_id: DatabaseUUID;

  // Basic information
  name: string;
  email: string;
  title: string | null;
  company_name: string | null;
  phone: string | null;

  // Company/industry details
  industry: string | null;
  company_size: CompanySize | null;
  geographic_region: GeographicRegion | null;

  // Expertise and specialization
  use_cases: string[] | null;
  expertise_areas: string[] | null;
  success_stories: SuccessStory[] | null;
  
  // Profile and presentation
  bio: string | null;
  profile_photo_url: string | null;
  testimonials: Testimonial[] | null;

  // Availability and capacity
  availability_score: number; // 0-100
  total_calls_completed: number;
  last_call_date: DatabaseTimestamp | null;
  max_calls_per_month: number;

  // Preferences and constraints
  preferred_call_times: string[] | null;
  timezone: string;
  languages: string[];
  call_duration_preference: number; // 15, 30, 45, 60 minutes

  // Program participation
  status: AdvocateStatus;
  enrollment_date: DatabaseTimestamp;
  last_activity_date: DatabaseTimestamp;

  // Rewards and incentives
  total_rewards_earned: number;
  preferred_reward_type: RewardType;

  // Internal notes and categorization
  internal_notes: string | null;
  tags: string[] | null;

  // Quality metrics
  average_rating: number | null; // 1.0-5.0
  total_ratings: number;

  // Timestamps
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// Opportunity Entity
export interface Opportunity {
  id: DatabaseUUID;
  company_id: DatabaseUUID;
  sales_rep_id: DatabaseUUID;

  // Prospect information
  prospect_company: string;
  prospect_contact_name: string | null;
  prospect_contact_email: string | null;
  prospect_contact_title: string | null;
  prospect_phone: string | null;
  prospect_website: string | null;

  // Company classification
  prospect_industry: string | null;
  prospect_size: CompanySize | null;
  geographic_region: GeographicRegion | null;

  // Opportunity details
  opportunity_name: string;
  use_case: string | null;
  product_interest: string[] | null;
  technical_requirements: string[] | null;
  business_challenges: string[] | null;

  // Deal information
  deal_value: number | null;
  currency: string;
  deal_stage: DealStage;
  probability: number | null; // 0-100
  expected_close_date: string | null; // Date string

  // Reference request details
  reference_request_status: ReferenceRequestStatus;
  reference_urgency: ReferenceUrgency;
  reference_type_needed: ReferenceTypeNeeded;

  // Matching requirements
  desired_advocate_industry: string | null;
  desired_advocate_size: CompanySize | null;
  desired_advocate_region: GeographicRegion | null;
  desired_use_cases: string[] | null;
  desired_expertise_areas: string[] | null;

  // CRM integration
  external_crm_id: string | null;
  external_crm_type: CrmType | null;
  external_crm_url: string | null;

  // Timeline and scheduling
  reference_needed_by: string | null; // Date string
  follow_up_date: string | null; // Date string
  created_date: string; // Date string

  // Internal tracking
  internal_notes: string | null;
  sales_notes: string | null;
  competitive_situation: string | null;
  decision_criteria: string[] | null;
  key_stakeholders: string[] | null;

  // Classification
  tags: string[] | null;
  priority_score: number; // 0-100

  // Activity tracking
  last_activity_date: DatabaseTimestamp;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// Reference Call Entity
export interface ReferenceCall {
  id: DatabaseUUID;

  // Core relationships
  opportunity_id: DatabaseUUID;
  advocate_id: DatabaseUUID;
  sales_rep_id: DatabaseUUID;

  // Prospect information
  prospect_name: string | null;
  prospect_email: string | null;
  prospect_title: string | null;
  prospect_company: string | null;
  prospect_phone: string | null;

  // Call scheduling
  scheduled_at: DatabaseTimestamp | null;
  actual_start_time: DatabaseTimestamp | null;
  actual_end_time: DatabaseTimestamp | null;
  duration_minutes: number | null;
  timezone: string;

  // Meeting details
  meeting_link: string | null;
  meeting_platform: MeetingPlatform | null;
  meeting_id: string | null;
  meeting_password: string | null;
  calendar_event_id: string | null;

  // Call status and lifecycle
  status: CallStatus;
  cancellation_reason: string | null;
  reschedule_count: number;

  // Pre-call preparation
  briefing_materials: string[] | null;
  talking_points: string[] | null;
  questions_to_cover: string[] | null;
  advocate_briefed: boolean;
  prospect_briefed: boolean;

  // Call intelligence and AI analysis
  call_recording_url: string | null;
  call_transcript: string | null;
  call_intelligence: Record<string, unknown> | null;
  ai_summary: string | null;
  key_topics_discussed: string[] | null;
  sentiment_score: number | null; // -1.0 to 1.0

  // Post-call feedback
  advocate_feedback: Record<string, unknown> | null;
  prospect_feedback: Record<string, unknown> | null;
  sales_rep_feedback: Record<string, unknown> | null;

  // Ratings and quality
  advocate_rating: number | null; // 1-5
  call_quality_rating: number | null; // 1-5
  technical_quality_score: number | null; // 1-10
  business_value_score: number | null; // 1-10

  // Follow-up actions
  follow_up_required: boolean;
  follow_up_actions: string[] | null;
  follow_up_completed: boolean;
  next_steps: string | null;

  // Rewards and incentives
  reward_amount: number | null;
  reward_type: RewardType | null;
  reward_status: RewardStatus;
  reward_notes: string | null;

  // Outcome and impact
  call_outcome: CallOutcome | null;
  deal_impact: DealImpact | null;
  next_call_recommended: boolean | null;
  reference_strength: ReferenceStrength | null;

  // Internal tracking
  internal_notes: string | null;
  tags: string[] | null;
  call_preparation_time_minutes: number | null;
  total_effort_score: number | null; // 1-10

  // External integration
  external_meeting_id: string | null;
  external_recording_id: string | null;
  crm_activity_id: string | null;

  // Timestamps
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// Utility types for database operations
export type InsertCompany = Omit<Company, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCompany = Partial<InsertCompany>;

export type InsertUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUser = Partial<InsertUser>;

export type InsertAdvocate = Omit<Advocate, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAdvocate = Partial<InsertAdvocate>;

export type InsertOpportunity = Omit<
  Opportunity,
  'id' | 'created_at' | 'updated_at'
>;
export type UpdateOpportunity = Partial<InsertOpportunity>;

export type InsertReferenceCall = Omit<
  ReferenceCall,
  'id' | 'created_at' | 'updated_at'
>;
export type UpdateReferenceCall = Partial<InsertReferenceCall>;

// Database query result types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DatabaseListResponse<T> {
  data: T[];
  error: Error | null;
  count?: number;
}

// Common query options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Filter types for common queries
export interface AdvocateFilters {
  company_id?: DatabaseUUID;
  status?: AdvocateStatus | AdvocateStatus[];
  industry?: string;
  company_size?: CompanySize;
  geographic_region?: string;
  availability_score_min?: number;
  use_cases?: string[];
  expertise_areas?: string[];
  tags?: string[];
}

export interface OpportunityFilters {
  company_id?: DatabaseUUID;
  sales_rep_id?: DatabaseUUID;
  deal_stage?: DealStage | DealStage[];
  reference_request_status?: ReferenceRequestStatus | ReferenceRequestStatus[];
  reference_urgency?: ReferenceUrgency | ReferenceUrgency[];
  prospect_industry?: string;
  prospect_size?: CompanySize;
  expected_close_date_before?: string;
  expected_close_date_after?: string;
  tags?: string[];
}

export interface ReferenceCallFilters {
  company_id?: DatabaseUUID;
  advocate_id?: DatabaseUUID;
  sales_rep_id?: DatabaseUUID;
  opportunity_id?: DatabaseUUID;
  status?: CallStatus | CallStatus[];
  call_outcome?: CallOutcome | CallOutcome[];
  deal_impact?: DealImpact | DealImpact[];
  scheduled_after?: DatabaseTimestamp;
  scheduled_before?: DatabaseTimestamp;
  tags?: string[];
}


// Additional types for enhanced advocate profiles
export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company?: string;
}

export interface SuccessStory {
  title: string;
  description: string;
  metrics?: string[];
  date?: string;
}
