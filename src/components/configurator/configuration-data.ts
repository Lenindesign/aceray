export interface MaterialOption {
  id: string
  name: string
  description?: string
  swatchUrl: string
  collection?: string
  hexHint?: string
}

export interface ChairConfiguration {
  fabricId: string
  woodId: string
}

export interface ProductDetails {
  id: string
  modelNumber: string
  title: string
  designer: string
  madeIn: string
  dimensions: {
    overallHeight: string
    overallWidth: string
    overallDepth: string
    seatHeight: string
    weight: string
  }
  basePrice: number
  grade: string
  leadTime: string
}

export const PRODUCT_100_01: ProductDetails = {
  id: '100-01',
  modelNumber: '#100-01',
  title: 'Side Chair',
  designer: 'Studio Tipi',
  madeIn: 'Italy',
  dimensions: {
    overallHeight: '33.5"',
    overallWidth: '17.5"',
    overallDepth: '20"',
    seatHeight: '18"',
    weight: '15.5 lbs',
  },
  basePrice: 780,
  grade: 'Grade A (Planet Vinyl)',
  leadTime: '4–6 Weeks',
}

export const FABRICS: MaterialOption[] = [
  {
    id: '1194',
    name: '1194',
    description: 'Sand Olive',
    collection: 'Planet',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0001s_0023_1194.jpg',
    hexHint: '#987d52',
  },
  {
    id: '1307',
    name: '1307',
    description: 'Terracotta Chestnut',
    collection: 'Planet',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0001s_0022_1307.jpg',
    hexHint: '#673625',
  },
  {
    id: '71',
    name: '71',
    description: 'Golden Mustard',
    collection: 'Planet',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0001s_0021_71.jpg',
    hexHint: '#a68231',
  },
  {
    id: '680',
    name: '680',
    description: 'Crimson Cherry',
    collection: 'Planet',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0001s_0020_680.jpg',
    hexHint: '#8a0214',
  },
]

export const WOOD_FINISHES: MaterialOption[] = [
  {
    id: 'bleached-beech',
    name: 'Bleached Beech',
    description: 'Light architectural natural beech',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0005s_0008_Bleached-Beech.jpg',
    hexHint: '#d9bf9a',
  },
  {
    id: 'natural-beech',
    name: 'Natural Beech',
    description: 'Warm clear lacquer beech',
    swatchUrl: '/assets/migrated/fabrics-and-finishes_0005s_0005_natural-beech.jpg',
    hexHint: '#bc9061',
  },
  {
    id: 'honey',
    name: 'Honey',
    description: 'Golden amber stain',
    swatchUrl: '/assets/migrated/honey.jpg',
    hexHint: '#b3753a',
  },
  {
    id: 'oak-h',
    name: 'Oak H',
    description: 'Medium rustic dark oak tone',
    swatchUrl: '/assets/migrated/aok-H.png',
    hexHint: '#87643a',
  },
]

export const DEFAULT_CONFIGURATION: ChairConfiguration = {
  fabricId: '1194',
  woodId: 'bleached-beech',
}

export function getChairImagePath(fabricId: string, woodId: string): string {
  return `/chair-configurator/chair-${fabricId}-${woodId}.png`
}

export function getConfigurationDisplayName(fabricId: string, woodId: string): string {
  const fabric = FABRICS.find((f) => f.id === fabricId) || FABRICS[0]
  const wood = WOOD_FINISHES.find((w) => w.id === woodId) || WOOD_FINISHES[0]
  return `${fabric.name} Fabric / ${wood.name} Wood`
}

export function isValidFabric(id: string): boolean {
  return FABRICS.some((f) => f.id === id)
}

export function isValidWood(id: string): boolean {
  return WOOD_FINISHES.some((w) => w.id === woodIdParam(id))
}

export function woodIdParam(rawId: string): string {
  const normalized = rawId.toLowerCase().trim().replace(/\s+/g, '-')
  if (normalized === 'bleached' || normalized === 'bleachedbeech') return 'bleached-beech'
  if (normalized === 'natural' || normalized === 'naturalbeech') return 'natural-beech'
  if (normalized === 'oakh' || normalized === 'oak-h' || normalized === 'oak') return 'oak-h'
  return normalized
}

/**
 * Returns list of all 16 valid combinations with their image paths and names
 */
export function getAllConfigurations() {
  const combos: Array<{
    fabric: MaterialOption
    wood: MaterialOption
    imagePath: string
    displayName: string
  }> = []

  for (const fabric of FABRICS) {
    for (const wood of WOOD_FINISHES) {
      combos.push({
        fabric,
        wood,
        imagePath: getChairImagePath(fabric.id, wood.id),
        displayName: `${fabric.name} Fabric / ${wood.name} Wood`,
      })
    }
  }

  return combos
}
