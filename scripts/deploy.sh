#!/bin/bash

# Deployment script for PeerChamps
# This script handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed"
        exit 1
    fi
    
    if ! command_exists vercel; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    print_success "Prerequisites check passed"
}

# Function to build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    pnpm install --frozen-lockfile
    
    # Run type check
    pnpm type-check
    
    # Run linting
    pnpm lint
    
    # Run tests
    pnpm test
    
    # Build application
    pnpm build
    
    print_success "Application built successfully"
}

# Function to deploy to staging
deploy_staging() {
    print_status "Deploying to staging..."
    
    # Set environment variables for staging
    export NODE_ENV=staging
    export NEXT_PUBLIC_APP_ENV=staging
    
    # Deploy to Vercel
    vercel --prod --env staging
    
    print_success "Deployed to staging successfully"
}

# Function to deploy to production
deploy_production() {
    print_status "Deploying to production..."
    
    # Set environment variables for production
    export NODE_ENV=production
    export NEXT_PUBLIC_APP_ENV=production
    
    # Deploy to Vercel
    vercel --prod --env production
    
    print_success "Deployed to production successfully"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Check if Supabase CLI is installed
    if ! command_exists supabase; then
        print_error "Supabase CLI is not installed"
        exit 1
    fi
    
    # Run migrations
    supabase db push
    
    print_success "Database migrations completed"
}

# Function to seed database
seed_database() {
    print_status "Seeding database..."
    
    # Run seed script
    pnpm run seed:db
    
    print_success "Database seeded successfully"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build       Build the application"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment"
    echo "  migrate     Run database migrations"
    echo "  seed        Seed the database"
    echo "  full        Full deployment (build + deploy + migrate)"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 staging"
    echo "  $0 production"
    echo "  $0 full"
}

# Main script logic
main() {
    case "${1:-help}" in
        "build")
            check_prerequisites
            build_app
            ;;
        "staging")
            check_prerequisites
            build_app
            deploy_staging
            ;;
        "production")
            check_prerequisites
            build_app
            deploy_production
            ;;
        "migrate")
            check_prerequisites
            run_migrations
            ;;
        "seed")
            check_prerequisites
            seed_database
            ;;
        "full")
            check_prerequisites
            build_app
            run_migrations
            deploy_production
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
