-- ====================================================================
-- RELOOP SEED DATA
-- Sample resources, needs, categories, and circular transfers
-- ====================================================================

-- Note: In production Supabase, UUIDs would tie to actual auth.users.
-- Below is a reference seed script for manual staging.

INSERT INTO public.profiles (id, full_name, email, account_type, description, city, is_verified, is_admin)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'EcoWood Workshop', 'contact@ecowood.org', 'workshop', 'Makerspace specializing in reclaimed timber, carpentry, and upcycling furniture.', 'Portland, OR', true, false),
  ('00000000-0000-0000-0000-000000000002', 'Green Roots Community Farm', 'grow@greenroots.org', 'ngo', 'Urban agriculture collective transforming food waste and organic materials into compost.', 'Seattle, WA', true, false),
  ('00000000-0000-0000-0000-000000000003', 'Circuit Saver Tech', 'fix@circuitsaver.com', 'repairer', 'Dedicated electronics repair hub rescuing appliances and laptops from e-waste.', 'Austin, TX', true, false),
  ('00000000-0000-0000-0000-000000000004', 'ReLoop Admin Team', 'admin@reloop.org', 'individual', 'ReLoop Platform Administrator and community trust officer.', 'Global Support', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.resources (
  id, user_id, title, description, category, quantity, available_quantity, unit, 
  allow_partial_quantity, condition, listing_type, price, location_name, city, lat, lng, status
)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Reclaimed Douglas Fir Timber Planks (8ft)',
    'High quality seasoned Douglas fir planks salvaged from architectural renovations. Nails removed, clean and ready for woodworking, shelving, or rustic furniture.',
    'Wood & Furniture',
    24, 24, 'planks',
    true, 'good', 'giveaway', 0,
    'Central Eastside Industrial District', 'Portland', 45.5152, -122.6658, 'active'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Organic Spent Coffee Grounds (Nitrogen Rich)',
    'Daily fresh spent coffee grounds collected in clean 5-gallon food-grade buckets. Ideal for compost pile nitrogen activation or mushroom cultivation substrate.',
    'Organic & Compost',
    10, 10, 'buckets',
    true, 'new', 'donation', 0,
    'Ballard Community Hub', 'Seattle', 47.6685, -122.3831, 'active'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Vintage Stereo Amplifier (Power Supply Issue)',
    'Classic Marantz receiver with solid metal faceplate. Powers on with intermittent output. Great candidate for electronics repair enthusiasts or parts salvage.',
    'Electronics & Components',
    1, 1, 'unit',
    false, 'salvage_repairable', 'giveaway', 0,
    'East Austin Maker Hub', 'Austin', 30.2672, -97.7231, 'active'
  )
ON CONFLICT (id) DO NOTHING;
