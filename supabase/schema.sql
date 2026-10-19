-- ====================================================================
-- RELOOP DATABASE SCHEMA (Supabase PostgreSQL)
-- Complete tables, RLS policies, indexes, and triggers
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE user_account_type AS ENUM (
        'individual', 'business', 'ngo', 'educational', 'workshop', 'repairer', 'recycler'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE resource_condition AS ENUM (
        'new', 'like_new', 'good', 'fair', 'salvage_repairable'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_type_enum AS ENUM (
        'giveaway', 'donation', 'sale', 'exchange', 'rent_lend', 'recovery'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_status_enum AS ENUM (
        'active', 'reserved', 'unavailable', 'expired', 'completed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE request_status_enum AS ENUM (
        'pending', 'accepted', 'rejected', 'cancelled', 'completed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ====================================================================
-- 3. TABLES
-- ====================================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    account_type user_account_type DEFAULT 'individual'::user_account_type NOT NULL,
    description TEXT,
    avatar_url TEXT,
    phone TEXT,
    organization_name TEXT,
    organization_reg_no TEXT,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL,
    city TEXT,
    state TEXT,
    country TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    address_privacy TEXT DEFAULT 'approximate' CHECK (address_privacy IN ('approximate', 'city_only', 'exact_pickup')),
    contact_preference TEXT DEFAULT 'in_app' CHECK (contact_preference IN ('in_app', 'email', 'phone')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    available_quantity NUMERIC NOT NULL CHECK (available_quantity >= 0),
    unit TEXT NOT NULL,
    allow_partial_quantity BOOLEAN DEFAULT true NOT NULL,
    condition resource_condition NOT NULL,
    listing_type listing_type_enum NOT NULL,
    price NUMERIC DEFAULT 0 CHECK (price >= 0),
    currency TEXT DEFAULT 'USD' NOT NULL,
    location_name TEXT NOT NULL,
    city TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    pickup_instructions TEXT,
    location_privacy TEXT DEFAULT 'approximate' CHECK (location_privacy IN ('approximate', 'city_only', 'private_on_request')),
    status listing_status_enum DEFAULT 'active'::listing_status_enum NOT NULL,
    expiry_date TIMESTAMPTZ,
    safety_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. RESOURCE_IMAGES
CREATE TABLE IF NOT EXISTS public.resource_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. NEEDS (PUBLISHED NEEDS)
CREATE TABLE IF NOT EXISTS public.needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity_required NUMERIC NOT NULL CHECK (quantity_required > 0),
    unit TEXT NOT NULL,
    acceptable_condition TEXT[] DEFAULT '{}'::TEXT[],
    budget NUMERIC DEFAULT 0,
    preferred_location TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    deadline TIMESTAMPTZ,
    can_collect BOOLEAN DEFAULT true NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, resource_id)
);

-- 6. RESOURCE_REQUESTS
CREATE TABLE IF NOT EXISTS public.resource_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_quantity NUMERIC NOT NULL CHECK (requested_quantity > 0),
    message TEXT,
    status request_status_enum DEFAULT 'pending'::request_status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    participant_one UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_two UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT distinct_participants CHECK (participant_one <> participant_two)
);

-- 8. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reported_resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. ORGANIZATION_VERIFICATIONS
CREATE TABLE IF NOT EXISTS public.organization_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    document_urls TEXT[] DEFAULT '{}'::TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. SUPPORT_REQUESTS
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. MODERATION_LOGS
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. RESOURCE_TRANSFERS
CREATE TABLE IF NOT EXISTS public.resource_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_id UUID REFERENCES public.resource_requests(id) ON DELETE SET NULL,
    confirmed_quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    outcome_type TEXT NOT NULL CHECK (outcome_type IN ('reuse', 'donation', 'sale', 'repair', 'upcycle', 'repurpose', 'recycle', 'compost')),
    notes TEXT,
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 4. INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_user ON public.resources(user_id);
CREATE INDEX IF NOT EXISTS idx_needs_category ON public.needs(category);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_p1 ON public.conversations(participant_one);
CREATE INDEX IF NOT EXISTS idx_conversations_p2 ON public.conversations(participant_two);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_transfers ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles:
-- Public fields can be read by all authenticated or anon visitors
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles
FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Admins can update any profile (e.g. verification status)
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (public.is_admin());

-- Resources:
-- Anyone can read active resources
CREATE POLICY "Anyone can view active resources" ON public.resources
FOR SELECT USING (
  status = 'active' 
  OR auth.uid() = user_id 
  OR public.is_admin()
);

-- Users can insert their own resources
CREATE POLICY "Authenticated users can create resources" ON public.resources
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owners and admins can update their resources
CREATE POLICY "Owners and admins can update resources" ON public.resources
FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Owners and admins can delete their resources
CREATE POLICY "Owners and admins can delete resources" ON public.resources
FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Resource Images:
CREATE POLICY "Anyone can view resource images" ON public.resource_images
FOR SELECT USING (true);

CREATE POLICY "Owners can manage resource images" ON public.resource_images
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.resources 
    WHERE id = resource_images.resource_id AND (user_id = auth.uid() OR public.is_admin())
  )
);

-- Needs:
CREATE POLICY "Anyone can view active needs" ON public.needs
FOR SELECT USING (status = 'active' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create needs" ON public.needs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own needs" ON public.needs
FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own needs" ON public.needs
FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- Favorites:
CREATE POLICY "Users can view own favorites" ON public.favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
FOR DELETE USING (auth.uid() = user_id);

-- Resource Requests:
CREATE POLICY "Participants or admins can view requests" ON public.resource_requests
FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Requesters can create requests" ON public.resource_requests
FOR INSERT WITH CHECK (auth.uid() = requester_id AND auth.uid() <> owner_id);

CREATE POLICY "Participants can update requests" ON public.resource_requests
FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = owner_id OR public.is_admin());

-- Conversations:
CREATE POLICY "Conversation participants can view conversation" ON public.conversations
FOR SELECT USING (auth.uid() = participant_one OR auth.uid() = participant_two OR public.is_admin());

CREATE POLICY "Participants can create conversation" ON public.conversations
FOR INSERT WITH CHECK ((auth.uid() = participant_one OR auth.uid() = participant_two) AND participant_one <> participant_two);

-- Messages:
CREATE POLICY "Conversation participants can view messages" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = messages.conversation_id AND (participant_one = auth.uid() OR participant_two = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Conversation participants can send messages" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = messages.conversation_id AND (participant_one = auth.uid() OR participant_two = auth.uid())
  )
);

CREATE POLICY "Participants can mark messages read" ON public.messages
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = messages.conversation_id AND (participant_one = auth.uid() OR participant_two = auth.uid())
  )
);

-- Notifications:
CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Reports:
CREATE POLICY "Reporters can view own reports and admins can view all" ON public.reports
FOR SELECT USING (auth.uid() = reporter_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reports" ON public.reports
FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update reports" ON public.reports
FOR UPDATE USING (public.is_admin());

-- Support Requests:
CREATE POLICY "Users can view own support requests and admins can view all" ON public.support_requests
FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Anyone can submit support requests" ON public.support_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update support requests" ON public.support_requests
FOR UPDATE USING (public.is_admin());

-- Moderation Logs:
CREATE POLICY "Admins can view moderation logs" ON public.moderation_logs
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert moderation logs" ON public.moderation_logs
FOR INSERT WITH CHECK (public.is_admin());

-- Resource Transfers:
CREATE POLICY "Transfer participants or admins can view transfers" ON public.resource_transfers
FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = receiver_id OR public.is_admin());

CREATE POLICY "Participants can insert transfers" ON public.resource_transfers
FOR INSERT WITH CHECK (auth.uid() = owner_id OR auth.uid() = receiver_id OR public.is_admin());

-- Organization Verifications:
CREATE POLICY "Users can view own verification, admins can view all" ON public.organization_verifications
FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can request verification" ON public.organization_verifications
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update verification" ON public.organization_verifications
FOR UPDATE USING (public.is_admin());

-- ====================================================================
-- 6. TRIGGER FOR AUTOMATIC PROFILE CREATION ON SIGNUP
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'account_type')::user_account_type, 'individual'::user_account_type)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Supabase Realtime for messages & notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resource_requests;
