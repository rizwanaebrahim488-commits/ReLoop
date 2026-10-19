// Next Best Use Circular Pathway Engine for ReLoop

export const NEXT_BEST_USE_PATHWAYS = {
  'food_perishables': [
    {
      title: 'Immediate Food Rescue / Food Bank Donation',
      badge: 'Donation',
      conditionRequired: 'Fresh, sealed, within safe handling shelf life',
      description: 'Connect with local food shelters, soup kitchens, or community fridges for immediate redistribution before peak freshness lapses.',
      targetCategory: 'Food & Perishables',
      safetyNote: 'CRITICAL: Unsafe, spoiled, thawed, or moldy food must NEVER be offered for human consumption.'
    },
    {
      title: 'Aerobic Hot Composting & Soil Enrichment',
      badge: 'Compost',
      conditionRequired: 'Past edible life, raw fruit/vegetable scraps, coffee grounds, grain residues',
      description: 'Transfer to community gardens or urban agriculture farms as high-nitrogen organic matter for thermal compost bins.',
      targetCategory: 'Organic & Compost',
      safetyNote: 'Do not compost large quantities of dairy, cooked oils, or diseased crops in standard open bins.'
    }
  ],
  'flowers_decor': [
    {
      title: 'Care Facility & Hospital Re-gifting',
      badge: 'Re-gifting',
      conditionRequired: 'Freshly cut post-event florals in water or florist foam',
      description: 'Repackage event floral centerpieces into smaller bouquets for nursing homes, hospices, or community centers.',
      targetCategory: 'Flowers & Event Decorations'
    },
    {
      title: 'Petal Drying & Natural Pigment Extraction',
      badge: 'Repurpose',
      conditionRequired: 'Wilting blossoms, untreated roses, marigolds, or lavender',
      description: 'Makers and craft artisans utilize dried petals for botanical soaps, natural textile dyeing, and handmade paper.',
      targetCategory: 'Craft Materials'
    },
    {
      title: 'Green Waste Composting',
      badge: 'Compost',
      conditionRequired: 'Spent stems and foliage',
      description: 'Strip all plastic tapes, wire binders, and floral foam before shredding for brown/green compost balance.',
      targetCategory: 'Organic & Compost'
    }
  ],
  'clothes_textiles': [
    {
      title: 'Garment Repair & Custom Alteration',
      badge: 'Repair',
      conditionRequired: 'High quality fabric with minor tear, missing buttons, or broken zipper',
      description: 'Connect with community repair cafes, seamstresses, and tailoring students.',
      targetCategory: 'Clothes & Textiles'
    },
    {
      title: 'Patchwork Crafts & Quilting Remnants',
      badge: 'Upcycle',
      conditionRequired: 'Unwearable garments with salvageable 100% cotton, wool, denim, or linen panels',
      description: 'Textile artists, quilters, and bag makers can repurpose durable denim and woven fabrics.',
      targetCategory: 'Craft Materials'
    },
    {
      title: 'Industrial Rags & Acoustic Insulation',
      badge: 'Recovery',
      conditionRequired: 'Clean, shredded cotton remnants',
      description: 'Automotive shops and workshops utilize clean cotton rags; shredded fibers make acoustic absorption panels.',
      targetCategory: 'Industrial Surplus'
    }
  ],
  'wood_furniture': [
    {
      title: 'Makerspace Carpentry & Woodturning Offcuts',
      badge: 'Maker Project',
      conditionRequired: 'Solid timber, hardwood remnants, clean untreated pallet timber',
      description: 'Small offcuts are highly sought after by woodturners, toy makers, and cutting board crafters.',
      targetCategory: 'Wood & Furniture'
    },
    {
      title: 'Upcycling & Re-finishing Project',
      badge: 'Upcycle',
      conditionRequired: 'Structurally sound furniture requiring sanding, painting, or reupholstery',
      description: 'DIY enthusiasts transform dated wooden dressers and tables into modern statement pieces.',
      targetCategory: 'Wood & Furniture'
    },
    {
      title: 'Biochar & Clean Biomass Fuel',
      badge: 'Recovery',
      conditionRequired: '100% raw untreated natural wood, completely free of paints, laminates, and chemical varnishes',
      description: 'Thermal conversion to horticultural biochar or clean firewood for off-grid heating.',
      targetCategory: 'Organic & Compost',
      safetyNote: 'Never burn treated wood (CCA, creosote, painted wood) due to toxic emissions.'
    }
  ],
  'electronics_components': [
    {
      title: 'Repair Clinic & Hobbyist Diagnostics',
      badge: 'Repair',
      conditionRequired: 'Defective unit with power issues, bad capacitors, or broken ports',
      description: 'Repair clinics and electronics hobbyists can replace modular parts and prevent premature landfill dumping.',
      targetCategory: 'Electronics & Components'
    },
    {
      title: 'Component Harvesting & Robotics Spares',
      badge: 'Salvage',
      conditionRequired: 'Non-repairable chassis with salvageable motors, transformers, wire harnesses, or passive components',
      description: 'Student engineering labs and maker spaces salvage stepper motors, heat sinks, and wiring.',
      targetCategory: 'Electronics & Components'
    },
    {
      title: 'Authorized WEEE E-Waste Depollution',
      badge: 'Certified E-Waste',
      conditionRequired: 'Irreparable e-waste containing lithium batteries or hazardous heavy metals',
      description: 'Direct to certified municipal or state e-waste collection points for safe precious metal hydrometallurgical recovery.',
      targetCategory: 'Industrial Surplus',
      safetyNote: 'Damaged lithium-ion batteries must NEVER be placed in curbside trash; keep taped in fire-safe bins.'
    }
  ],
  'packaging_cardboard': [
    {
      title: 'Permaculture Sheet Mulching (Lasagna Gardening)',
      badge: 'Compost / Garden',
      conditionRequired: 'Plain corrugated cardboard with tape and glossy labels peeled off',
      description: 'Suppresses weeds, retains soil moisture, and decomposes into rich worm humus under wood chips.',
      targetCategory: 'Organic & Compost'
    },
    {
      title: 'E-commerce Circular Reuse Loop',
      badge: 'Direct Reuse',
      conditionRequired: 'Intact shipping cartons, clean bubble pouches, air pillows',
      description: 'Local small online sellers and crafters gratefully reuse clean shipping cartons to avoid virgin box purchases.',
      targetCategory: 'Packaging & Boxes'
    }
  ]
};

/**
 * Get Next Best Use pathways for a given category or resource
 */
export function getNextBestUsePathways(categoryId) {
  if (!categoryId) return [];
  const normalized = categoryId.toLowerCase().replace(/[^a-z0-9]/g, '_');

  // Direct mapping or fallback
  for (const [key, pathways] of Object.entries(NEXT_BEST_USE_PATHWAYS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return pathways;
    }
  }

  // Generic circular pathway
  return [
    {
      title: 'Local Repairer & Maker Clinic',
      badge: 'Circular Repair',
      description: 'Explore connecting with nearby repair cafes or vocational schools that accept items for student repair workshops.',
      targetCategory: 'Reusable Equipment'
    },
    {
      title: 'Material Exchange / Parts Harvesting',
      badge: 'Recovery',
      description: 'Disassemble into core reusable constituent materials (metals, fasteners, hardware) for workshop reuse.',
      targetCategory: 'Industrial Surplus'
    }
  ];
}
