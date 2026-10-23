// Rich Initial Data for ReLoop Platform
// Used as seed and in-memory/localStorage store when Supabase client is in development mode

export const INITIAL_PROFILES = [
  {
    id: 'user-1',
    full_name: 'Elena Rostova',
    email: 'elena@ecowood.org',
    account_type: 'workshop',
    description: 'Lead carpenter at Urban Timber Rescue. We save construction offcuts and turn them into community tables.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 234-8901',
    organization_name: 'Urban Timber Rescue',
    organization_reg_no: 'REG-99482-OR',
    is_verified: true,
    is_admin: false,
    city: 'Portland, OR',
    lat: 45.5152,
    lng: -122.6658,
    address_privacy: 'approximate',
    contact_preference: 'in_app',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'user-2',
    full_name: 'Marcus Chen',
    email: 'marcus@greenroots.org',
    account_type: 'ngo',
    description: 'Community compost coordinator at Green Roots Farm. Building healthy soil from organic residues.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 345-6789',
    organization_name: 'Green Roots Urban Agriculture',
    organization_reg_no: 'NGO-88219-WA',
    is_verified: true,
    is_admin: false,
    city: 'Seattle, WA',
    lat: 47.6685,
    lng: -122.3831,
    address_privacy: 'city_only',
    contact_preference: 'in_app',
    created_at: '2026-01-12T09:30:00Z'
  },
  {
    id: 'user-3',
    full_name: 'Amina Al-Mansoor',
    email: 'amina@circuitsaver.com',
    account_type: 'repairer',
    description: 'Electronics technician at Circuit Saver Clinic. Certified in appliance diagnostic and e-waste prevention.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 987-6543',
    organization_name: 'Circuit Saver Clinic',
    organization_reg_no: 'TX-REP-1102',
    is_verified: true,
    is_admin: false,
    city: 'Austin, TX',
    lat: 30.2672,
    lng: -97.7231,
    address_privacy: 'approximate',
    contact_preference: 'in_app',
    created_at: '2026-01-15T11:00:00Z'
  },
  {
    id: 'user-admin',
    full_name: 'ReLoop Administrator',
    email: 'admin@reloop.org',
    account_type: 'individual',
    description: 'ReLoop Community Trust & Moderation Team.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 000-1122',
    organization_name: 'ReLoop Platform Trust',
    organization_reg_no: 'ADMIN-CORE',
    is_verified: true,
    is_admin: true,
    city: 'San Francisco, CA',
    lat: 37.7749,
    lng: -122.4194,
    address_privacy: 'approximate',
    contact_preference: 'in_app',
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    user_id: 'user-1',
    title: 'Reclaimed Douglas Fir Timber Planks (8ft)',
    description: 'Seasoned Douglas fir dimensional lumber salvaged from architectural interior deconstruction. Cleaned of fasteners, dry, ready for woodworking, open shelving, or outdoor planters.',
    category: 'Wood & Furniture',
    quantity: 24,
    available_quantity: 24,
    unit: 'planks',
    allow_partial_quantity: true,
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Central Eastside Industrial District',
    city: 'Portland, OR',
    lat: 45.5152,
    lng: -122.6658,
    pickup_instructions: 'Loading dock 3. Available weekdays 9am to 4pm. Please bring tie-down straps.',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'All nails and staples extracted. Untreated interior lumber.',
    images: [
      'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-01T10:00:00Z'
  },
  {
    id: 'res-2',
    user_id: 'user-2',
    title: 'Fresh Spent Espresso Coffee Grounds (Nitrogen Rich)',
    description: 'High-nitrogen organic spent grounds collected daily from cooperative cafe partners. Stored in sanitized 5-gallon food grade buckets with tight lids. Excellent for thermophilic compost activation or oyster mushroom substrate.',
    category: 'Organic & Compost',
    quantity: 12,
    available_quantity: 12,
    unit: '5-gal buckets',
    allow_partial_quantity: true,
    condition: 'new',
    listing_type: 'donation',
    price: 0,
    currency: 'USD',
    location_name: 'Ballard Urban Farm Annex',
    city: 'Seattle, WA',
    lat: 47.6685,
    lng: -122.3831,
    pickup_instructions: 'Behind community garden barn. Return clean buckets or swap with your own.',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-11-30T23:59:59Z',
    safety_notes: 'Pure coffee grounds without dairy contamination.',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-02T11:15:00Z'
  },
  {
    id: 'res-3',
    user_id: 'user-3',
    title: 'Vintage Solid-State Audio Stereo Receiver (Needs Fuse/Capacitor)',
    description: 'Classic 1970s brushed aluminum audio amplifier. Lights turn on but right channel has low audio hum. Chassis and potentiometers in good shape. Ideal restoration candidate for audio tinkerers or electronics repair students.',
    category: 'Electronics & Components',
    quantity: 1,
    available_quantity: 1,
    unit: 'unit',
    allow_partial_quantity: false,
    condition: 'salvage_repairable',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'East Austin Repair Collective',
    city: 'Austin, TX',
    lat: 30.2672,
    lng: -97.7231,
    pickup_instructions: 'Pickup inside workshop front counter during open clinic hours (Thu-Sat 12-6pm).',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-10-31T23:59:59Z',
    safety_notes: 'Unplugged. Do not open power supply without discharging filter capacitors.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-03T14:30:00Z'
  },
  {
    id: 'res-4',
    user_id: 'user-1',
    title: 'Clean Heavy Corrugated Moving Boxes & Packing Rolls',
    description: 'Over 40 double-walled clean moving boxes, collapsed flat with tape cleanly sliced. Also includes 2 large rolls of clean kraft paper wrap. Kept indoors and dry.',
    category: 'Packaging & Boxes',
    quantity: 40,
    available_quantity: 40,
    unit: 'boxes',
    allow_partial_quantity: true,
    condition: 'like_new',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Inner Southeast Neighborhood',
    city: 'Portland, OR',
    lat: 45.5122,
    lng: -122.6587,
    pickup_instructions: 'Porch pickup with advance messaging.',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-12-01T00:00:00Z',
    safety_notes: 'Dry, completely clean.',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-04T09:00:00Z'
  },
  {
    id: 'res-5',
    user_id: 'user-2',
    title: 'Botanical Event Centerpieces & Cut Peonies',
    description: 'Over 15 exquisite floral arrangements from a weekend conference. Hydrated in fresh water vases. Beautiful blooms ready for care home donations, community celebrations, or petal craft drying.',
    category: 'Flowers & Event Decorations',
    quantity: 15,
    available_quantity: 15,
    unit: 'arrangements',
    allow_partial_quantity: true,
    condition: 'new',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Seattle Downtown Convention Center',
    city: 'Seattle, WA',
    lat: 47.6115,
    lng: -122.3321,
    pickup_instructions: 'Loading dock bay 4. Must be picked up within 48 hours for maximum freshness.',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-03-01T18:00:00Z',
    safety_notes: 'Floral stems cut fresh; return glass vases if possible or keep for reuse.',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-05T16:00:00Z'
  },
  {
    id: 'res-6',
    user_id: 'user-3',
    title: 'Heavy Denim & Canvas Fabric Remnants (10kg)',
    description: 'Industrial textile remnants and roll ends from a workwear manufacturer. Heavyweight raw indigo denim and cotton duck canvas. Perfect for upcycled tote bags, tool rolls, or durable aprons.',
    category: 'Clothes & Textiles',
    quantity: 10,
    available_quantity: 10,
    unit: 'kg',
    allow_partial_quantity: true,
    condition: 'new',
    listing_type: 'sale',
    price: 25,
    currency: 'USD',
    location_name: 'South Congress Maker Quarter',
    city: 'Austin, TX',
    lat: 30.2458,
    lng: -97.7511,
    pickup_instructions: 'Can coordinate contactless porch pickup.',
    location_privacy: 'approximate',
    status: 'active',
    expiry_date: '2026-12-15T00:00:00Z',
    safety_notes: 'Clean factory textile offcuts.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-06T12:00:00Z'
  },
  {
    id: 'res-7',
    user_id: 'user-1',
    title: 'ThinkPad T480 Core i5 Laptop (Working, Ready for SSD)',
    description: 'Corporate decommissioned ThinkPad T480 laptop. Intel Core i5 8th Gen, 16GB DDR4 RAM, backlit keyboard, dual batteries included. Storage drive was wiped/removed for security; boots into BIOS cleanly. Needs an M.2 SSD and OS installation.',
    category: 'Electronics & Components',
    quantity: 3,
    available_quantity: 3,
    unit: 'laptops',
    allow_partial_quantity: true,
    condition: 'good',
    listing_type: 'sale',
    price: 45,
    currency: 'USD',
    location_name: 'Koramangala 4th Block',
    city: 'Bengaluru',
    lat: 12.9352,
    lng: 77.6245,
    pickup_instructions: 'Pickup near Tech Park gate. Can test with power supply on site.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Tested working motherboard and display.',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-07T14:00:00Z'
  },
  {
    id: 'res-8',
    user_id: 'user-2',
    title: 'Dell UltraSharp 24-inch IPS Monitor (Surplus Office Stock)',
    description: 'Crisp Full HD 1080p IPS displays with pivot, tilt, and height-adjustable stand. DisplayPort, HDMI, and USB 3.0 hub built-in. Fully tested, zero dead pixels.',
    category: 'Electronics & Components',
    quantity: 5,
    available_quantity: 5,
    unit: 'monitors',
    allow_partial_quantity: true,
    condition: 'like_new',
    listing_type: 'sale',
    price: 35,
    currency: 'USD',
    location_name: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    lat: 19.0657,
    lng: 72.8687,
    pickup_instructions: 'Office reception pickup during business hours (10am - 6pm).',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Includes power cable and HDMI cable.',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-08T10:00:00Z'
  },
  {
    id: 'res-9',
    user_id: 'user-3',
    title: 'Assorted Cat6 Ethernet, HDMI & Power Patch Cables (50m Bundle)',
    description: 'Clean excess cabling from an IT studio reorganization. Five 5m Cat6 cables, three 10m high-speed cables, two braided HDMI 2.0 cables, and standard IEC power leads.',
    category: 'Electronics & Components',
    quantity: 1,
    available_quantity: 1,
    unit: 'box',
    allow_partial_quantity: false,
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Connaught Place Area',
    city: 'Delhi NCR',
    lat: 28.6315,
    lng: 77.2167,
    pickup_instructions: 'Easy contactless porch pickup.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'All tested working.',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-09T11:00:00Z'
  },
  {
    id: 'res-10',
    user_id: 'user-1',
    title: 'Solid Teak Wood Dining Chairs (Set of 4, Sturdy Handcrafted)',
    description: 'Four mid-century solid plantation teak dining chairs. Mortise-and-tenon joinery with no wobbles. Upholstery fabric could use a spot clean or refresh, but frames are heirloom quality.',
    category: 'Wood & Furniture',
    quantity: 4,
    available_quantity: 4,
    unit: 'chairs',
    allow_partial_quantity: true,
    condition: 'good',
    listing_type: 'sale',
    price: 60,
    currency: 'USD',
    location_name: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    pickup_instructions: 'Ground floor pickup. Can assist with loading.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Solid hardwood, very sturdy.',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-10T12:00:00Z'
  },
  {
    id: 'res-11',
    user_id: 'user-2',
    title: 'Heavy Duty Wooden Shipping Pallets (Heat Treated, 10 Pcs)',
    description: 'Standard 48x40 heat-treated (HT stamped) wooden warehouse pallets. Dry, clean, stored indoors. Ideal for DIY garden furniture, vertical planters, or modular compost bins.',
    category: 'Wood & Furniture',
    quantity: 10,
    available_quantity: 10,
    unit: 'pallets',
    allow_partial_quantity: true,
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Industrial Way Warehousing',
    city: 'Seattle',
    lat: 47.5707,
    lng: -122.3382,
    pickup_instructions: 'Drive-in loading bay. Take any quantity from 1 to 10.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Heat treated, chemical-free.',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-11T09:30:00Z'
  },
  {
    id: 'res-12',
    user_id: 'user-3',
    title: 'Industrial Sewing Machine Stand & Cast Iron Table',
    description: 'Heavy duty vintage steel and cast-iron industrial sewing machine base with foot treadle pedal and laminated tabletop. Extremely stable workbench for craft sewing or cafe table.',
    category: 'Tools & Machinery',
    quantity: 1,
    available_quantity: 1,
    unit: 'table',
    allow_partial_quantity: false,
    condition: 'good',
    listing_type: 'sale',
    price: 65,
    currency: 'USD',
    location_name: 'Peenya Industrial Area',
    city: 'Bengaluru',
    lat: 13.0285,
    lng: 77.5195,
    pickup_instructions: 'Heavy item (approx 35kg). Please bring someone to assist lifting.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Sturdy cast iron base.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-12T15:00:00Z'
  },
  {
    id: 'res-13',
    user_id: 'user-1',
    title: 'Bosch Professional 800W Rotary Hammer Drill & Bits',
    description: 'Heavy duty corded SDS-plus rotary hammer drill with hammer and chiseling modes. Includes 5 SDS drill bits and original carrying case. Works flawlessly for concrete and masonry.',
    category: 'Tools & Machinery',
    quantity: 1,
    available_quantity: 1,
    unit: 'tool',
    allow_partial_quantity: false,
    condition: 'good',
    listing_type: 'rent_lend',
    price: 10,
    currency: 'USD',
    location_name: 'Andheri West Workshop',
    city: 'Mumbai',
    lat: 19.1364,
    lng: 72.8277,
    pickup_instructions: 'Loan rate $10/day with refundable deposit.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Includes eye protection goggles.',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-13T10:00:00Z'
  },
  {
    id: 'res-14',
    user_id: 'user-2',
    title: 'Salvaged Red Clay Heritage Bricks (Cleaned, ~160 Pcs)',
    description: 'Solid wire-cut red architectural bricks salvaged from an old masonry patio dismantle. Mortar knocked off cleanly. High thermal mass, gorgeous terracotta tone. Great for garden edging or pizza ovens.',
    category: 'Building & Hardware Materials',
    quantity: 160,
    available_quantity: 160,
    unit: 'bricks',
    allow_partial_quantity: true,
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'South Extension II',
    city: 'Delhi NCR',
    lat: 28.5683,
    lng: 77.2185,
    pickup_instructions: 'Stacked near curb. Back your vehicle up to stack.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Clean brickwork.',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-14T08:00:00Z'
  },
  {
    id: 'res-15',
    user_id: 'user-3',
    title: 'Galvanized Corrugated Steel Roofing Sheets (6ft, 8 Panels)',
    description: 'Surplus corrugated 26-gauge galvanized steel roofing panels. Stored dry, no rust. 72 inches length by 26 inches width. Perfect for tool sheds or garden structures.',
    category: 'Building & Hardware Materials',
    quantity: 8,
    available_quantity: 8,
    unit: 'sheets',
    allow_partial_quantity: true,
    condition: 'like_new',
    listing_type: 'sale',
    price: 30,
    currency: 'USD',
    location_name: 'East Austin Maker District',
    city: 'Austin',
    lat: 30.2672,
    lng: -97.7431,
    pickup_instructions: 'Daytime collection.',
    status: 'active',
    expiry_date: '2026-12-31T23:59:59Z',
    safety_notes: 'Wear work gloves.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    created_at: '2026-02-15T11:00:00Z'
  }
];

export const INITIAL_NEEDS = [
  {
    id: 'need-1',
    user_id: 'user-2',
    title: 'Reclaimed Timber Planks for Community Raised Beds',
    description: 'Seeking untreated cedar, pine, or fir planks to build vegetable planter boxes for our community education garden. Nails are okay if easily removable.',
    category: 'Wood & Furniture',
    quantity_required: 15,
    unit: 'planks',
    acceptable_condition: ['new', 'like_new', 'good', 'fair'],
    budget: 0,
    preferred_location: 'Seattle, WA or Pacific Northwest',
    lat: 47.6685,
    lng: -122.3831,
    deadline: '2026-11-01T00:00:00Z',
    can_collect: true,
    status: 'active',
    created_at: '2026-02-02T13:00:00Z'
  },
  {
    id: 'need-2',
    user_id: 'user-3',
    title: 'Vintage Amplifiers & Audio Components for Student Clinic',
    description: 'Our repair clinic is running a free electronics diagnostic workshop for high school youth. Looking for non-working receivers, cassette decks, or speaker enclosures for teaching repair.',
    category: 'Electronics & Components',
    quantity_required: 4,
    unit: 'units',
    acceptable_condition: ['good', 'fair', 'salvage_repairable'],
    budget: 20,
    preferred_location: 'Austin, TX',
    lat: 30.2672,
    lng: -97.7231,
    deadline: '2026-10-25T00:00:00Z',
    can_collect: true,
    status: 'active',
    created_at: '2026-02-03T15:00:00Z'
  },
  {
    id: 'need-3',
    user_id: 'user-1',
    title: 'Organic Green Material / Nitrogen Residues for Compost Heating',
    description: 'Need spent coffee grounds or brewery spent grains to jumpstart thermophilic composting in our workshop winter bin.',
    category: 'Organic & Compost',
    quantity_required: 5,
    unit: 'buckets',
    acceptable_condition: ['new', 'like_new', 'good'],
    budget: 0,
    preferred_location: 'Portland, OR',
    lat: 45.5152,
    lng: -122.6658,
    deadline: '2026-12-01T00:00:00Z',
    can_collect: true,
    status: 'active',
    created_at: '2026-02-04T10:00:00Z'
  }
];

export const INITIAL_FAVORITES = [
  { id: 'fav-1', user_id: 'user-1', resource_id: 'res-2', created_at: '2026-02-03T10:00:00Z' },
  { id: 'fav-2', user_id: 'user-2', resource_id: 'res-1', created_at: '2026-02-03T11:00:00Z' }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    resource_id: 'res-1',
    requester_id: 'user-2',
    owner_id: 'user-1',
    requested_quantity: 8,
    message: 'Hello Elena, we would love to collect 8 planks for our garden beds. I have a flatbed pickup truck and can come by Thursday morning.',
    status: 'accepted',
    created_at: '2026-02-03T12:00:00Z',
    updated_at: '2026-02-03T14:00:00Z'
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    resource_id: 'res-1',
    participant_one: 'user-1',
    participant_two: 'user-2',
    last_message_at: '2026-02-03T14:05:00Z',
    created_at: '2026-02-03T12:00:00Z'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'user-2',
    content: 'Hi Elena! I placed a request for 8 Douglas fir planks. Does Thursday 10am work for collection?',
    is_read: true,
    created_at: '2026-02-03T12:01:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_id: 'user-1',
    content: 'Hi Marcus! Yes, Thursday at 10am is perfect. Ill have them staged near loading dock 3 for easy loading.',
    is_read: true,
    created_at: '2026-02-03T14:05:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'request_received',
    title: 'New Resource Request',
    message: 'Marcus Chen requested 8 planks of Reclaimed Douglas Fir Timber Planks.',
    link: '/requests',
    is_read: false,
    created_at: '2026-02-03T12:00:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-2',
    type: 'request_accepted',
    title: 'Request Accepted',
    message: 'Elena Rostova approved your request for Douglas Fir Timber Planks.',
    link: '/requests',
    is_read: true,
    created_at: '2026-02-03T14:00:00Z'
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    reporter_id: 'user-2',
    reported_user_id: null,
    reported_resource_id: 'res-3',
    reason: 'Safety concern check',
    description: 'Listing clearly mentions capacitor safety, marking as reviewed and safe.',
    status: 'reviewed',
    created_at: '2026-02-04T08:00:00Z',
    updated_at: '2026-02-04T09:00:00Z'
  }
];

export const INITIAL_SUPPORT_REQUESTS = [
  {
    id: 'sup-1',
    user_id: 'user-1',
    name: 'Elena Rostova',
    email: 'elena@ecowood.org',
    subject: 'Request to register our workshop branch in Eugene',
    message: 'We are expanding our timber salvage shop to Eugene, OR. Can we link multiple drop-off hubs to one organization account?',
    status: 'open',
    admin_notes: 'Follow up with organization multi-location feature roadmap.',
    created_at: '2026-02-05T09:00:00Z'
  }
];
