# PeerChamp Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name**: PeerChamp  
**Product Type**: AI-Powered Customer Reference Call Platform  
**Target Market**: B2B Enterprise Companies (150-500 employees)  
**Primary Value Proposition**: Transform customer reference calls from chaotic "fire drills" into professional, scalable workflows that accelerate sales cycles

**Tech Stack**:

- Frontend: Next.js (React-based)
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Deployment: Vercel
- AI/ML: OpenAI GPT-4 for matching and intelligence
- Scheduling: Calendar integrations (Google Calendar, Outlook)

## 2. Problem Statement

Enterprise sales teams face a broken customer reference process characterized by:

- **Chaotic Search**: Hours wasted on internal detective work through stale spreadsheets
- **Bottlenecks**: Reliance on informal networks and CSM favors
- **Advocate Burnout**: Overuse of the same 3-4 customers
- **Scheduling Hell**: Manual email coordination between prospects, advocates, and sales reps
- **Lost Intelligence**: Valuable conversation insights disappear into a black box

## 3. Product Vision & Strategy

### 3.1 Vision Statement

To become the definitive platform for B2B sales teams to leverage customer advocates as their most trusted closing asset, creating measurable impact on win rates and sales velocity.

### 3.2 Strategic Positioning

- **Sales-First**: Unlike marketing-focused competitors (Influitive, SlapFive), we prioritize live sales conversations
- **Workflow-Native**: Seamlessly integrate into existing CRM workflows (Salesforce, HubSpot)
- **Intelligence-Driven**: Capture and analyze "Voice of the Decisive Moment" conversations
- **Compliance-First**: Enterprise-grade reward processing and advocate protection

## 4. User Personas & Use Cases

### 4.1 Primary Personas

#### Enterprise Account Executive (Primary User)

**Pain Points**:

- Needs references for high-value deals ($50K+)
- Time pressure during end-of-quarter pushes
- Limited visibility into advocate availability
- Manual scheduling coordination

**Goals**:

- Find perfect-fit advocates quickly
- Schedule calls without admin overhead
- Gain intelligence from reference conversations
- Close deals faster with social proof

#### Customer Advocate

**Pain Points**:

- Overwhelmed with reference requests
- No control over scheduling preferences
- Lack of recognition for contributions
- Unclear about time commitments

**Goals**:

- Control participation frequency
- Convenient scheduling process
- Professional recognition/rewards
- Help peers succeed with the product

#### Customer Success Manager / Reference Program Manager

**Pain Points**:

- Protecting customer relationships
- Tracking advocate engagement
- Proving program ROI
- Manual administrative overhead

**Goals**:

- Prevent advocate burnout
- Scale reference programs efficiently
- Demonstrate revenue impact
- Maintain advocate satisfaction

### 4.2 Core User Journeys

#### Journey 1: Sales Rep Reference Request

1. Rep identifies need for reference during sales opportunity
2. Opens PeerChamp from within CRM (Salesforce/HubSpot)
3. AI suggests best-fit advocates based on:
   - Industry match
   - Use case similarity
   - Product configuration
   - Geographic relevance
   - Advocate availability/fatigue score
4. Rep reviews AI recommendations and selects advocate
5. System generates "magic link" for prospect
6. Rep shares link with prospect via email/demo

#### Journey 2: Prospect Booking Experience

1. Prospect receives personalized link from sales rep
2. Views advocate profile (curated, professional)
3. Sees real-time calendar availability
4. Books 30-minute slot in one click
5. Receives confirmation with video link and prep materials
6. Joins call at scheduled time

#### Journey 3: Advocate Participation

1. Advocate receives booking notification
2. Reviews prospect context and talking points
3. Joins scheduled call
4. Completes post-call feedback form
5. Selects reward preference from compliance menu
6. Receives instant reward fulfillment

## 5. Functional Requirements

### 5.1 Core Platform Features

#### 5.1.1 AI-Powered Advocate Matching

**Requirements**:

- Analyze prospect profile (industry, company size, use case)
- Score advocates based on relevance factors
- Consider advocate availability and fatigue metrics
- Present top 3-5 recommendations with confidence scores
- Learn from successful matches to improve recommendations

**Database Schema**:

```sql
-- Advocates table
CREATE TABLE advocates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  title TEXT,
  company_name TEXT,
  industry TEXT,
  company_size TEXT,
  use_cases TEXT[],
  geographic_region TEXT,
  expertise_areas TEXT[],
  availability_score INTEGER DEFAULT 100,
  total_calls_completed INTEGER DEFAULT 0,
  last_call_date TIMESTAMP,
  max_calls_per_month INTEGER DEFAULT 4,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  sales_rep_id UUID REFERENCES users(id),
  prospect_company TEXT NOT NULL,
  prospect_industry TEXT,
  prospect_size TEXT,
  use_case TEXT,
  deal_value DECIMAL,
  stage TEXT,
  urgency TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5.1.2 Seamless Scheduling System

**Requirements**:

- Calendar integration (Google Calendar, Outlook, Calendly)
- Real-time availability display
- Time zone handling
- Automated meeting creation with video links
- Reminder notifications (24h, 1h before)
- Rescheduling/cancellation handling

**API Integrations Needed**:

- Google Calendar API
- Microsoft Graph API (Outlook)
- Zoom/Teams meeting generation
- SendGrid for email notifications

#### 5.1.3 CRM Integration (Salesforce & HubSpot)

**Requirements**:

- Native app/widget within Opportunity records
- Bidirectional data sync
- Activity logging
- Custom fields for reference tracking
- Report generation

**Salesforce Integration**:

```javascript
// Salesforce Lightning Component
// Embed PeerChamp widget in Opportunity page layout
const PeerChampWidget = () => {
  const [opportunity, setOpportunity] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch opportunity data from Salesforce
    // Call PeerChamp API for advocate recommendations
  }, []);

  return (
    <div className="peerchamp-widget">
      <RecommendationList recommendations={recommendations} />
      <BookingInterface />
    </div>
  );
};
```

#### 5.1.4 Post-Call Intelligence Engine

**Requirements**:

- Call recording integration (Gong, Chorus, Zoom)
- AI-powered conversation analysis
- Key insights extraction:
  - Competitive mentions
  - Objections raised
  - Success factors highlighted
  - Next steps identified
- CRM activity creation with intelligence summary

**AI Analysis Pipeline**:

```python
# Pseudocode for call analysis
def analyze_reference_call(transcript):
    insights = {
        'competitive_intel': extract_competitors_mentioned(transcript),
        'objections': identify_objections(transcript),
        'success_factors': extract_value_props_discussed(transcript),
        'prospect_sentiment': analyze_sentiment(transcript),
        'next_steps': identify_action_items(transcript)
    }
    return insights
```

#### 5.1.5 Compliance-First Rewards Engine

**Requirements**:

- Enterprise-compliant reward options:
  - Charitable donations (primary)
  - Professional development funds
  - Direct stipends (platform-processed)
  - Company credits/team rewards
- Instant fulfillment processing
- Tax documentation (1099 generation)
- Reward tracking and reporting

### 5.2 Advanced Features

#### 5.2.1 Advocate Fatigue Prevention

**Requirements**:

- Track advocate participation frequency
- Implement "cooling off" periods
- Automated fatigue scoring
- Proactive notifications to prevent burnout
- Alternative advocate suggestions when primary choice unavailable

#### 5.2.2 Program Analytics Dashboard

**Requirements**:

- Revenue influence tracking
- Conversion rate analysis (booking → closed won)
- Advocate satisfaction scores
- Program ROI calculations
- Executive reporting templates

#### 5.2.3 Multi-Company Support

**Requirements**:

- Tenant isolation for enterprise security
- Role-based access control
- White-label options for larger clients
- API access for custom integrations

## 6. Technical Architecture

### 6.1 System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Database      │
│   (Next.js)     │◄───┤   (Next.js)      │◄───┤   (Supabase)    │
│                 │    │                  │    │   PostgreSQL    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                       ▲
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CRM Systems   │    │   AI Services    │    │   External APIs │
│   (SF/HubSpot)  │    │   (OpenAI)       │    │   (Calendar/Email)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 6.2 Database Design

**Core Tables**:

```sql
-- Companies (Tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'professional',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (Sales Reps, Advocates, Admins)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- 'sales_rep', 'advocate', 'admin'
  profile JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reference Calls
CREATE TABLE reference_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id),
  advocate_id UUID REFERENCES advocates(id),
  sales_rep_id UUID REFERENCES users(id),
  prospect_email TEXT,
  prospect_name TEXT,
  scheduled_at TIMESTAMP,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  meeting_link TEXT,
  call_intelligence JSONB,
  advocate_feedback JSONB,
  reward_amount DECIMAL,
  reward_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6.3 API Design

**Core Endpoints**:

```javascript
// Advocate Matching
POST /api/advocates/match
{
  "opportunity_id": "uuid",
  "filters": {
    "industry": "saas",
    "company_size": "mid-market",
    "use_case": "sales_automation"
  }
}

// Booking Creation
POST /api/bookings
{
  "advocate_id": "uuid",
  "opportunity_id": "uuid",
  "prospect_info": {
    "name": "John Smith",
    "email": "john@prospect.com",
    "company": "Prospect Corp"
  }
}

// Call Intelligence
POST /api/calls/{call_id}/analyze
{
  "transcript": "...",
  "recording_url": "..."
}
```

## 7. Non-Functional Requirements

### 7.1 Performance

- Page load times < 2 seconds
- API response times < 500ms
- Support for 1000+ concurrent users
- 99.9% uptime SLA

### 7.2 Security

- SOC 2 Type II compliance
- GDPR/CCPA compliance
- End-to-end encryption for sensitive data
- Role-based access control (RBAC)
- Single Sign-On (SSO) support

### 7.3 Scalability

- Horizontal scaling via Vercel
- Database connection pooling
- CDN for static assets
- Caching strategy for frequently accessed data

## 8. Implementation Phases

### Phase 1: MVP (Months 1-3)

**Core Features**:

- Basic advocate matching (rule-based)
- Simple scheduling interface
- CRM integration (Salesforce only)
- Basic reward processing
- Admin dashboard

**Success Metrics**:

- 1 design partner onboarded
- 10+ reference calls completed
- Positive user feedback (NPS > 7)

### Phase 2: Enhanced Features (Months 4-6)

**Added Features**:

- AI-powered matching algorithms
- HubSpot integration
- Call intelligence analysis
- Advanced analytics dashboard
- Mobile app (PWA)

**Success Metrics**:

- 5 paying customers
- $50K+ influenced pipeline per customer
- 50% reduction in reference call setup time

### Phase 3: Scale & Optimization (Months 7-12)

**Added Features**:

- Multi-tenant architecture
- White-label options
- Advanced reporting
- API for custom integrations
- Enterprise security features

**Success Metrics**:

- $500K ARR
- 25+ enterprise customers
- Industry recognition/awards

## 9. Success Metrics & KPIs

### 9.1 Product Metrics

- **Time to First Reference Call**: < 24 hours from signup
- **Reference Call Completion Rate**: > 85%
- **Advocate Satisfaction Score**: NPS > 8
- **Sales Rep Adoption Rate**: > 70% active usage

### 9.2 Business Metrics

- **Pipeline Influence**: $X influenced per customer per month
- **Win Rate Improvement**: X% increase when references used
- **Sales Cycle Reduction**: X days faster close with references
- **Customer Retention**: > 95% annual retention

### 9.3 Technical Metrics

- **System Uptime**: 99.9%
- **Average Response Time**: < 500ms
- **Error Rate**: < 0.1%
- **User Session Duration**: > 15 minutes average

## 10. Risk Assessment & Mitigation

### 10.1 Technical Risks

**Risk**: CRM integration complexity  
**Mitigation**: Start with Salesforce, use established connector patterns, invest in robust testing

**Risk**: AI matching accuracy  
**Mitigation**: Combine AI with rule-based fallbacks, continuous learning from user feedback

### 10.2 Business Risks

**Risk**: Advocate participation fatigue  
**Mitigation**: Built-in fatigue prevention, strong reward system, value demonstration

**Risk**: Competitive response from incumbents  
**Mitigation**: Focus on superior user experience, faster innovation cycles

### 10.3 Go-to-Market Risks

**Risk**: Long enterprise sales cycles  
**Mitigation**: Concierge MVP approach, design partner strategy, land-and-expand model

## 11. Development Guidelines for AI Assistant

### 11.1 Code Structure

```
peerchamp/
├── components/          # Reusable React components
├── pages/              # Next.js pages and API routes
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # CSS and styling
├── public/             # Static assets
└── tests/              # Test files
```

### 11.2 Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase client
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (automatic deployments)
- **AI/ML**: OpenAI GPT-4 for matching and analysis
- **Testing**: Jest, React Testing Library, Cypress

### 11.3 Development Priorities

1. **User Experience First**: Prioritize intuitive, fast interfaces
2. **Mobile Responsive**: Ensure all components work on mobile devices
3. **Performance**: Optimize for speed and efficiency
4. **Security**: Implement proper data protection from day one
5. **Scalability**: Design for growth from the beginning

### 11.4 Integration Requirements

- Salesforce REST API and metadata API
- HubSpot API v3
- Google Calendar API
- OpenAI API for AI features
- Stripe for payment processing
- SendGrid for email delivery

This PRD provides a comprehensive foundation for building PeerChamp using the specified tech stack. The document includes detailed technical specifications, user stories, and implementation guidance suitable for AI-assisted development tools like Cursor.
