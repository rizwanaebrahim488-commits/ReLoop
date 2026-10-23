import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fdfubcqujufvnwozvzsc.supabase.co',
  'sb_publishable_diWjEDya6EHIvUWK09BvpQ_Hc3NrLCw'
);

const DEMO_RESOURCES = [
  {
    title: 'ThinkPad T480 Core i5 Laptop (Working, Ready for SSD)',
    description: 'Corporate decommissioned ThinkPad T480 laptop. Intel Core i5 8th Gen, 16GB DDR4 RAM, backlit keyboard, dual batteries included. Storage drive was wiped/removed for security; boots into BIOS cleanly. Needs an M.2 SSD and OS installation. Perfect repair project for students or open-source Linux users.',
    category: 'Electronics & Components',
    quantity: 3,
    available_quantity: 3,
    unit: 'laptops',
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
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Dell UltraSharp 24-inch IPS Monitor (Surplus Office Stock)',
    description: 'Crisp Full HD 1080p IPS displays with pivot, tilt, and height-adjustable stand. DisplayPort, HDMI, and USB 3.0 hub built-in. Fully tested, zero dead pixels, clean cosmetic condition with power and HDMI cables included.',
    category: 'Electronics & Components',
    quantity: 5,
    available_quantity: 5,
    unit: 'monitors',
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
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Assorted Cat6 Ethernet, HDMI & Power Patch Cables (50m Bundle)',
    description: 'Clean excess cabling from an IT studio reorganization. Includes five 5m Cat6 cables, three 10m high-speed cables, two braided HDMI 2.0 cables, and standard IEC power leads. All tested working.',
    category: 'Electronics & Components',
    quantity: 1,
    available_quantity: 1,
    unit: 'box',
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
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Reclaimed Douglas Fir Timber Planks (8ft Seasoned)',
    description: 'Seasoned Douglas fir dimensional lumber salvaged from architectural interior deconstruction. Cleaned of fasteners, completely dry, ready for woodworking, shelving, workbenches, or outdoor planters.',
    category: 'Wood & Furniture',
    quantity: 24,
    available_quantity: 24,
    unit: 'planks',
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Central Eastside Industrial District',
    city: 'Portland',
    lat: 45.5152,
    lng: -122.6658,
    pickup_instructions: 'Loading dock 3. Available weekdays 9am to 4pm. Please bring tie-down straps.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Solid Teak Wood Dining Chairs (Set of 4, Sturdy Handcrafted)',
    description: 'Four mid-century solid plantation teak dining chairs. Mortise-and-tenon joinery with no wobbles. Upholstery fabric could use a spot clean or modern refresh, but the hardwood frames are heirloom quality.',
    category: 'Wood & Furniture',
    quantity: 4,
    available_quantity: 4,
    unit: 'chairs',
    condition: 'good',
    listing_type: 'sale',
    price: 60,
    currency: 'USD',
    location_name: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    pickup_instructions: 'Ground floor pickup. Can assist with loading into car boot.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Heavy Duty Wooden Shipping Pallets (Heat Treated, 10 Pcs)',
    description: 'Standard 48x40 heat-treated (HT stamped) wooden warehouse pallets. Dry, clean, stored indoors. Ideal for DIY garden furniture, vertical planters, modular compost bins, or warehouse logistics.',
    category: 'Wood & Furniture',
    quantity: 10,
    available_quantity: 10,
    unit: 'pallets',
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Industrial Way Warehousing',
    city: 'Seattle',
    lat: 47.5707,
    lng: -122.3382,
    pickup_instructions: 'Drive-in loading bay. Can take any quantity from 1 to 10.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Live Edge Walnut Wood Slab Offcut (Kiln Dried)',
    description: 'Gorgeous figured American black walnut wood slab offcut. 42 inches long by 14 inches wide by 1.75 inches thick. Kiln-dried to 8% moisture. Fantastic grain figure, ideal for river resin tables or entryway console benches.',
    category: 'Wood & Furniture',
    quantity: 1,
    available_quantity: 1,
    unit: 'slab',
    condition: 'like_new',
    listing_type: 'sale',
    price: 45,
    currency: 'USD',
    location_name: 'Brooklyn Navy Yard Woodshop',
    city: 'New York',
    lat: 40.7018,
    lng: -73.9744,
    pickup_instructions: 'Building 77 dock. Easy parking outside.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Industrial Sewing Machine Stand & Cast Iron Table',
    description: 'Heavy duty vintage steel and cast-iron industrial sewing machine base with foot treadle pedal and laminated beech tabletop. Extremely stable workbench for craft sewing, leatherwork, or repurposed cafe table.',
    category: 'Tools & Machinery',
    quantity: 1,
    available_quantity: 1,
    unit: 'table',
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
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Bosch Professional 800W Rotary Hammer Drill & Masonry Bits',
    description: 'Heavy duty corded SDS-plus rotary hammer drill with hammer, chiseling, and rotary drilling modes. Includes 5 SDS masonry drill bits and original carrying case. Works flawlessly for concrete wall anchors.',
    category: 'Tools & Machinery',
    quantity: 1,
    available_quantity: 1,
    unit: 'tool',
    condition: 'good',
    listing_type: 'rent_lend',
    price: 10,
    currency: 'USD',
    location_name: 'Andheri West Workshop',
    city: 'Mumbai',
    lat: 19.1364,
    lng: 72.8277,
    pickup_instructions: 'Refundable security deposit required on pickup; $10/day loan rate.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Heavy Duty 6-Inch Cast Iron Swivel Bench Vise',
    description: 'Stout vintage mechanic bench vise with 360-degree swivel base, integrated anvil plate, and hardened steel serrated jaws. Weighs approximately 18kg. Smooth screw action, freshly greased.',
    category: 'Tools & Machinery',
    quantity: 1,
    available_quantity: 1,
    unit: 'vise',
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Okhla Industrial Area Phase III',
    city: 'Delhi NCR',
    lat: 28.5355,
    lng: 77.2687,
    pickup_instructions: 'Direct driveway collection.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Organic Spent Coffee Grounds (Nitrogen Rich, 5-Gal Buckets)',
    description: 'High-nitrogen organic spent espresso grounds collected daily from cooperative cafe partners. Stored in sanitized 5-gallon food grade buckets with tight lids. Excellent for thermophilic compost activation or oyster mushroom substrate.',
    category: 'Organic & Compost',
    quantity: 15,
    available_quantity: 15,
    unit: '5-gal buckets',
    condition: 'new',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Ballard Urban Farm Annex',
    city: 'Seattle',
    lat: 47.6685,
    lng: -122.3831,
    pickup_instructions: 'Behind community garden barn. Return clean buckets or swap with your own.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Seasoned Hardwood Oak Woodchips for Mulch & Mycelium',
    description: 'Fresh clean oak tree pruning woodchips from municipal tree care. Zero cedar or walnut oils. Ideal for garden soil moisture retention, weed suppression, or wine cap mushroom bed inoculation.',
    category: 'Organic & Compost',
    quantity: 8,
    available_quantity: 8,
    unit: 'large bags',
    condition: 'good',
    listing_type: 'donation',
    price: 0,
    currency: 'USD',
    location_name: 'Arboriculture Depot',
    city: 'Portland',
    lat: 45.5231,
    lng: -122.6765,
    pickup_instructions: 'Self-load bags provided.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Salvaged Red Clay Heritage Bricks (Cleaned, ~160 pcs)',
    description: 'Solid wire-cut red architectural bricks salvaged from an old masonry patio dismantle. Mortar knocked off cleanly. High thermal mass, gorgeous vintage terracotta color. Great for garden edging, rocket stoves, or pizza ovens.',
    category: 'Building & Hardware Materials',
    quantity: 160,
    available_quantity: 160,
    unit: 'bricks',
    condition: 'good',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'South Extension II',
    city: 'Delhi NCR',
    lat: 28.5683,
    lng: 77.2185,
    pickup_instructions: 'Stacked near curb. Back your hatchback or truck right up to stack.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Galvanized Corrugated Steel Roofing Sheets (6ft, 8 Panels)',
    description: 'Surplus corrugated 26-gauge galvanized steel roofing panels. Stored dry, no rust. 72 inches length by 26 inches width. Perfect for tool sheds, chicken coops, garden sheds, or industrial fence accents.',
    category: 'Building & Hardware Materials',
    quantity: 8,
    available_quantity: 8,
    unit: 'sheets',
    condition: 'like_new',
    listing_type: 'sale',
    price: 30,
    currency: 'USD',
    location_name: 'East Austin Maker District',
    city: 'Austin',
    lat: 30.2672,
    lng: -97.7431,
    pickup_instructions: 'Pickup during daytime. Wear work gloves when handling.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Heavy Denim & Cotton Duck Canvas Fabric Rolls (12kg Surplus)',
    description: 'Industrial textile remnants and roll ends from a workwear manufacturer. Heavyweight raw indigo denim and sturdy natural cotton duck canvas. Perfect for upcycled tote bags, tool rolls, aprons, or upholstery patches.',
    category: 'Clothes & Textiles',
    quantity: 12,
    available_quantity: 12,
    unit: 'kg',
    condition: 'new',
    listing_type: 'sale',
    price: 20,
    currency: 'USD',
    location_name: 'Commercial Street Garment Hub',
    city: 'Bengaluru',
    lat: 12.9822,
    lng: 77.6083,
    pickup_instructions: 'Packed in 2 clean woven sacks for easy carry.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Clean Heavy Corrugated Moving Boxes & Bubble Wrap (35 Pcs)',
    description: 'Clean, double-walled heavy cardboard moving boxes collapsed flat. Plus 3 large rolls of recyclable paper cushion wrap. Used once for an apartment move, kept dry indoors.',
    category: 'Packaging & Storage',
    quantity: 35,
    available_quantity: 35,
    unit: 'boxes',
    condition: 'like_new',
    listing_type: 'giveaway',
    price: 0,
    currency: 'USD',
    location_name: 'Powai Lake Residences',
    city: 'Mumbai',
    lat: 19.1176,
    lng: 72.9060,
    pickup_instructions: 'Building security will hand over anytime with advance message.',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

async function seed() {
  console.log('Clearing existing resources before seeding fresh test items...');
  await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log(`Inserting ${DEMO_RESOURCES.length} high-quality circular economy items...`);
  for (const item of DEMO_RESOURCES) {
    const { images, ...resData } = item;
    const { data: created, error } = await supabase
      .from('resources')
      .insert([resData])
      .select()
      .single();

    if (error) {
      console.error(`Error inserting "${item.title}":`, error.message);
    } else {
      console.log(`✓ Inserted: ${created.title} (${created.category} in ${created.city})`);
      if (images && images.length > 0) {
        const imageRows = images.map((url, idx) => ({
          resource_id: created.id,
          image_url: url,
          is_primary: idx === 0
        }));
        await supabase.from('resource_images').insert(imageRows);
      }
    }
  }

  const { data: allRows } = await supabase.from('resources').select('id, title, category, city');
  console.log(`\nAll done! Total items now in Supabase database: ${allRows ? allRows.length : 0}`);
}

seed();
