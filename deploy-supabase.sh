#!/bin/bash

# Supabase Edge Functions Deployment Script
# This script deploys all edge functions to your Supabase project

set -e  # Exit on error

echo "================================================"
echo "GCOMAN Supabase Deployment Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI is installed${NC}"
echo ""

# Project configuration
PROJECT_REF="wgoxcnnrkulrnhcmvdvt"

echo "Project Reference: $PROJECT_REF"
echo ""

# Check if already linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}Project not linked yet. Linking now...${NC}"
    supabase link --project-ref "$PROJECT_REF"
    echo -e "${GREEN}✓ Project linked successfully${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Project already linked${NC}"
    echo ""
fi

# Deploy edge functions
echo "================================================"
echo "Deploying Edge Functions"
echo "================================================"
echo ""

# Function 1: Contact Form Submission
echo -e "${YELLOW}Deploying submit-contact function...${NC}"
if supabase functions deploy submit-contact; then
    echo -e "${GREEN}✓ submit-contact deployed successfully${NC}"
else
    echo -e "${RED}✗ Failed to deploy submit-contact${NC}"
    exit 1
fi
echo ""

# Function 2: Job Application Submission
echo -e "${YELLOW}Deploying submit-job-application function...${NC}"
if supabase functions deploy submit-job-application; then
    echo -e "${GREEN}✓ submit-job-application deployed successfully${NC}"
else
    echo -e "${RED}✗ Failed to deploy submit-job-application${NC}"
    exit 1
fi
echo ""

# Function 3: Download Notification
echo -e "${YELLOW}Deploying notify-download function...${NC}"
if supabase functions deploy notify-download; then
    echo -e "${GREEN}✓ notify-download deployed successfully${NC}"
else
    echo -e "${RED}✗ Failed to deploy notify-download${NC}"
    exit 1
fi
echo ""

echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo ""
echo -e "${GREEN}All edge functions have been deployed successfully.${NC}"
echo ""
echo "Next steps:"
echo "1. Run the database setup SQL in Supabase dashboard"
echo "2. Configure environment variables in Lovable"
echo "3. Add admin access for sales@gcoman.com"
echo "4. Test contact form and career applications"
echo ""
echo "See SUPABASE_SETUP_GUIDE.md for detailed instructions."
echo ""
