// ReLoop Streamlined & User-Friendly Category Taxonomy
// Focused on high-utility, everyday categories without clutter or wall-of-text reading.

export const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    shortName: 'Electronics',
    icon: 'Cpu',
    tagline: 'Laptops, phones, appliances, cables & components',
    popularTags: ['Laptops', 'Audio & Speakers', 'Cables & Chargers', 'Home Appliances', 'Components'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange', 'recovery'],
    legacyNames: ['Electronics & Components'],
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-100',
    safetyGuidelines: 'Wipe all personal data. Ensure cords are undamaged. Hazardous batteries must be sent to certified e-waste facilities.',
    nextBestUse: 'Component harvesting (copper wire, stepper motors, capacitors) or community repair clinic restoration.'
  },
  {
    id: 'furniture_home',
    name: 'Furniture & Home',
    shortName: 'Furniture',
    icon: 'Armchair',
    tagline: 'Desks, chairs, sofas, storage, decor & kitchenware',
    popularTags: ['Desks & Tables', 'Chairs & Sofas', 'Kitchenware', 'Shelving & Storage', 'Home Decor'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange', 'rent_lend'],
    legacyNames: ['Wood & Furniture', 'Household Items'],
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-100',
    safetyGuidelines: 'Ensure items are structurally sound and clean. Check for loose screws or fasteners.',
    nextBestUse: 'Refurbishing, woodwork upcycling, starter kits for students, or shelter donations.'
  },
  {
    id: 'clothing_textiles',
    name: 'Clothing & Textiles',
    shortName: 'Clothing',
    icon: 'Shirt',
    tagline: 'Apparel, fabrics, shoes, curtains & linens',
    popularTags: ['Casual Wear', 'Fabric Bolts & Scraps', 'Jackets & Coats', 'Linens & Curtains', 'Shoes'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange'],
    legacyNames: ['Clothes & Textiles'],
    color: 'from-purple-500 to-pink-600',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-100',
    safetyGuidelines: 'Clean and freshly laundered items only. No heavily soiled or unhygienic textiles.',
    nextBestUse: 'Upcycle worn garments into rag quilts, acoustic insulation, or craft stuffing.'
  },
  {
    id: 'tools_hardware',
    name: 'Tools & Hardware',
    shortName: 'Tools & DIY',
    icon: 'Wrench',
    tagline: 'Power tools, hand tools, timber, paint & DIY supplies',
    popularTags: ['Hand Tools', 'Power Tools', 'Reclaimed Timber', 'Garden Tools', 'Hardware & Screws'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange', 'rent_lend', 'recovery'],
    legacyNames: ['Reusable Equipment', 'Construction Materials', 'Industrial Surplus'],
    color: 'from-emerald-500 to-teal-700',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    safetyGuidelines: 'Ensure safety guards, triggers, and cords are intact. No hazardous chemicals or asbestos.',
    nextBestUse: 'Tool library loans, makerspace community projects, or workshop fabrication.'
  },
  {
    id: 'books_stationery',
    name: 'Books & Stationery',
    shortName: 'Books & Paper',
    icon: 'BookOpen',
    tagline: 'Textbooks, novels, notebooks & art supplies',
    popularTags: ['Textbooks', 'Novels & Fiction', 'Art Supplies', 'Notebooks & Paper', 'Kids Books'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange'],
    legacyNames: ['Books & Stationery'],
    color: 'from-rose-500 to-red-600',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-100',
    safetyGuidelines: 'Clean, dry, and free of mold or water damage.',
    nextBestUse: 'Community free libraries, school literacy drives, or clean paper pulp recycling.'
  },
  {
    id: 'food_pantry',
    name: 'Food & Pantry',
    shortName: 'Food & Garden',
    icon: 'Apple',
    tagline: 'Safe surplus food, garden harvest & pantry staples',
    popularTags: ['Fresh Harvest', 'Sealed Pantry Goods', 'Bakery Surplus', 'Coffee Grounds', 'Compost Inputs'],
    allowedListingTypes: ['giveaway', 'donation'],
    legacyNames: ['Food & Perishables', 'Organic & Compost'],
    color: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 text-green-700 border-green-100',
    safetyGuidelines: 'Unsafe or expired spoiled food is strictly prohibited. Sealed pantry items or freshly harvested garden produce only.',
    nextBestUse: 'Direct community donation, animal feed (where compliant), or clean aerobic composting.'
  },
  {
    id: 'crafts_hobbies',
    name: 'Crafts & Hobbies',
    shortName: 'Crafts & Toys',
    icon: 'Scissors',
    tagline: 'Art remnants, musical gear, games & hobby kits',
    popularTags: ['Craft Remnants', 'Board Games & Toys', 'Musical Gear', 'Yarn & Sewing', 'Event Decor'],
    allowedListingTypes: ['giveaway', 'donation', 'sale', 'exchange'],
    legacyNames: ['Craft Materials', 'Flowers & Event Decorations'],
    color: 'from-fuchsia-500 to-purple-600',
    bgLight: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
    safetyGuidelines: 'Non-toxic, clean, and safe for hobbyists and educational makerspaces.',
    nextBestUse: 'Youth art programs, maker workshops, theater prop fabrication, or community festivals.'
  },
  {
    id: 'free_giveaways',
    name: 'Free Community Giveaways',
    shortName: 'Free Stuff',
    icon: 'Gift',
    tagline: '100% free surplus items ready for quick direct pickup',
    popularTags: ['Moving Boxes', 'Free Household', 'Curbside Pickup', 'Garden Seeds', 'Surplus Items'],
    allowedListingTypes: ['giveaway', 'donation'],
    legacyNames: ['Packaging & Boxes'],
    color: 'from-teal-500 to-cyan-600',
    bgLight: 'bg-teal-50 text-teal-700 border-teal-100',
    safetyGuidelines: 'Clean, non-hazardous surplus goods ready for immediate free collection.',
    nextBestUse: 'Direct neighbor-to-neighbor reuse, zero waste diversion from landfills.'
  }
];

// Helper: match category considering aliases and legacy taxonomy
export function matchesCategory(itemCategory = '', selectedCategory = 'all') {
  if (!selectedCategory || selectedCategory === 'all') return true;
  if (!itemCategory) return false;

  const itemLower = itemCategory.toLowerCase().trim();
  const selectedLower = selectedCategory.toLowerCase().trim();

  // Direct exact match
  if (itemLower === selectedLower) return true;

  // Find target category in definition
  const cat = CATEGORIES.find(c => 
    c.name.toLowerCase() === selectedLower || 
    c.id.toLowerCase() === selectedLower ||
    c.shortName?.toLowerCase() === selectedLower
  );

  if (!cat) {
    // Check if selected itself was a legacy name
    return itemLower.includes(selectedLower) || selectedLower.includes(itemLower);
  }

  // Match category name or its legacy aliases
  if (itemLower === cat.name.toLowerCase()) return true;
  if (cat.shortName && itemLower === cat.shortName.toLowerCase()) return true;
  if (cat.legacyNames?.some(legacy => legacy.toLowerCase() === itemLower)) return true;

  return false;
}

// Find category metadata by name or alias
export function getCategoryMeta(name = '') {
  if (!name) return CATEGORIES[0];
  const lower = name.toLowerCase().trim();
  const direct = CATEGORIES.find(c => 
    c.name.toLowerCase() === lower || 
    c.id.toLowerCase() === lower ||
    c.shortName?.toLowerCase() === lower
  );
  if (direct) return direct;

  const legacy = CATEGORIES.find(c => 
    c.legacyNames?.some(l => l.toLowerCase() === lower)
  );
  return legacy || CATEGORIES[0];
}

export const CONDITIONS = [
  { value: 'new', label: 'Brand New / Surplus', description: 'Unopened, never used, in original state.' },
  { value: 'like_new', label: 'Like New', description: 'Barely used, zero flaws or signs of wear.' },
  { value: 'good', label: 'Good Condition', description: 'Fully functional, minor cosmetic blemishes.' },
  { value: 'fair', label: 'Fair Condition', description: 'Noticeable wear, still performs intended primary use.' },
  { value: 'salvage_repairable', label: 'Salvage / Repairable', description: 'Requires fixing, tinkering, or component recovery.' }
];

export const LISTING_TYPES = [
  { value: 'giveaway', label: 'Free Giveaway', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { value: 'donation', label: 'Charity Donation', badgeColor: 'bg-teal-100 text-teal-800' },
  { value: 'sale', label: 'For Sale', badgeColor: 'bg-blue-100 text-blue-800' },
  { value: 'exchange', label: 'Material Exchange', badgeColor: 'bg-purple-100 text-purple-800' },
  { value: 'rent_lend', label: 'Rent / Lend', badgeColor: 'bg-amber-100 text-amber-800' },
  { value: 'recovery', label: 'Recycling / Recovery', badgeColor: 'bg-forest-100 text-forest-800' }
];

export const ACCOUNT_TYPES = [
  { value: 'individual', label: 'Individual / Resident' },
  { value: 'business', label: 'Local Business / Retailer' },
  { value: 'ngo', label: 'NGO / Non-Profit / Charity' },
  { value: 'educational', label: 'School / University / College' },
  { value: 'workshop', label: 'Makerspace / Craft Workshop' },
  { value: 'repairer', label: 'Professional Repairer / Clinic' },
  { value: 'recycler', label: 'Certified Recycler / Collector' }
];
