const DESIGNER_PROFILES = {
  'e-p-ciani-design': {
    location: 'San Giovanni al Natisone, Italy',
    disciplines: ['Furniture', 'Industrial design', 'Contract'],
    bio: 'Edi and Paolo Ciani are product and interior designers whose studio has developed furniture, office, contract, and outdoor products since 1987. Their work combines technical furniture knowledge, prototype development, ergonomics, and Made in Italy manufacturing experience.',
  },
  'e-and-p-ciani-design': {
    alias: 'e-p-ciani-design',
  },
  'studio-carlesi-tonelli': {
    location: 'Udine, Italy',
    disciplines: ['Industrial design', 'Furniture', 'Product development'],
    bio: 'Founded in 2004 by Davide Carlesi and Gian Luca Tonelli, CarlesiTonelli brings together industrial design, technical research, material exploration, and a precise drawing-led process. Their approach focuses on simple, durable forms shaped for production.',
  },
  'carlesi-tonelli': {
    alias: 'studio-carlesi-tonelli',
  },
  'calesi-tonelli': {
    alias: 'studio-carlesi-tonelli',
  },
  'carlessi-tonelli': {
    alias: 'studio-carlesi-tonelli',
  },
  'cartesi-e-tonelli': {
    alias: 'studio-carlesi-tonelli',
  },
  'lucidi-pevere': {
    location: 'Palmanova / Udine, Italy',
    disciplines: ['Industrial design', 'Furniture', 'Lighting'],
    bio: 'Paolo Lucidi and Luca Pevere met while studying industrial design at Politecnico di Milano and founded LucidiPevere in 2006. The studio is known for rigorous, material-aware work across furniture, lighting, home objects, bathroom products, and contract design.',
  },
  'balutto-associates': {
    location: 'Manzano, Italy',
    disciplines: ['Architecture', 'Design', 'Art direction'],
    bio: 'Balutto Associates works across architecture, object design, journalism, and art direction. The studio approach connects material interpretation, timeless form, and multidisciplinary design thinking from spaces down to individual objects.',
  },
  'massimo-iosa-ghini': {
    location: 'Bologna / Milan, Italy',
    disciplines: ['Architecture', 'Product design', 'Retail'],
    bio: 'Massimo Iosa Ghini is an Italian architect and designer, founder of the Bolidismo movement and a participant in the Memphis design avant-garde. His studio works internationally across product design, architecture, retail concepts, museums, and transportation environments.',
  },
  'arik-levy': {
    location: 'Paris, France',
    disciplines: ['Product design', 'Art', 'Sculpture'],
    bio: 'Arik Levy is an artist, sculptor, and industrial designer whose practice spans installations, stage design, public sculpture, furniture, lighting, and everyday objects. His work is recognized for material sensitivity and a strong sculptural language.',
  },
  'odo-fioravanti': {
    location: 'Milan, Italy',
    disciplines: ['Industrial design', 'Furniture', 'Product design'],
    bio: 'Odo Fioravanti is an industrial designer who graduated from Politecnico di Milano and founded Odo Fioravanti Design Studio in 2006. His work spans industrial products and furniture, with award-winning seating including the Compasso d’Oro-recognized Frida chair.',
  },
  'o-fioravanti': {
    alias: 'odo-fioravanti',
  },
  'christophe-pillet': {
    location: 'Paris, France',
    disciplines: ['Furniture', 'Interior architecture', 'Art direction'],
    bio: 'Christophe Pillet is a French designer and interior architect known for clear, refined, minimalist work. After studying decorative arts and completing a master’s at Domus Academy, he worked with Philippe Starck before founding his own agency in 1993.',
  },
  'chiaramonte-marin': {
    location: 'Venice Mestre, Italy',
    disciplines: ['Industrial design', 'Lighting', 'Interiors'],
    bio: 'Alfredo Chiaramonte and Marco Marin founded their design studio in 1989. Their multidisciplinary practice connects industrial products, lighting, interiors, graphics, and material experimentation, with work for furniture and Murano glass manufacturers.',
  },
  'favaretto-partners': {
    location: 'Padua, Italy',
    disciplines: ['Industrial design', 'Furniture', 'Strategy'],
    bio: 'Favaretto & Partners is an Italian industrial design studio with roots dating to 1973. The studio develops products through close collaboration with manufacturers, balancing function, process, market needs, engineering, and creative direction.',
  },
  'daniel-rode': {
    location: 'Italy / Vietnam',
    disciplines: ['Furniture', 'Product design', 'Manufacturing'],
    bio: 'Daniel Rode began in luggage and fashion accessories before moving into furniture design. His work is known for ergonomic, expressive structures, material contrast, and a balance of robust realism with lightness.',
  },
  'mikko-laakkonen': {
    location: 'Helsinki, Finland',
    disciplines: ['Furniture', 'Product design', 'Everyday objects'],
    bio: 'Mikko Laakkonen is a Finnish designer whose minimal and functional work focuses on durable products for everyday use. His background includes musical instrument making and furniture design, and his studio collaborates with international furniture brands.',
  },
  'luca-scacchetti': {
    location: 'Milan, Italy',
    disciplines: ['Architecture', 'Furniture', 'Interior design'],
    bio: 'Luca Scacchetti was an Italian architect and designer whose practice ranged from urban planning and buildings to interiors and individual objects. He taught architectural design and collaborated with leading furniture, office, lighting, bath, and luxury manufacturers.',
  },
  'a-and-t-design': {
    location: 'Italy',
    disciplines: ['Furniture', 'Contract seating', 'Tables & Bases'],
    bio: 'A & T Design creates sleek, versatile commercial furniture for Aceray, spanning barstools, lounge seating, counter stools, and dining tables engineered for hospitality and contract environments.',
  },
  'a-and-t-studio': {
    alias: 'a-and-t-design',
  },
  'arter-citton': {
    location: 'Italy',
    disciplines: ['Furniture', 'Contract seating', 'Product design'],
    bio: 'Arter & Citton is represented in Aceray through upholstered seating families designed for hospitality and contract environments, with an emphasis on clean silhouettes, comfort, and configurable commercial use.',
  },
  'gualtiero-ceschia': {
    location: 'Udine, Italy',
    disciplines: ['Furniture design', 'Contract seating', 'Upholstered armchairs'],
    bio: 'Gualtiero Ceschia is a renowned Italian furniture designer whose work for Aceray includes the iconic Duo and Solo seating collections. His designs balance architectural precision, ergonomic comfort, and enduring commercial craftsmanship.',
  },
  'glam-by-gualtiero-ceschia': {
    alias: 'gualtiero-ceschia',
  },
  'flora-ceschia': {
    alias: 'gualtiero-ceschia',
  },
  'ds-design': {
    location: 'Italy',
    disciplines: ['Furniture design', 'Technopolymer seating', 'Contract chairs'],
    bio: 'DS-Design creates modern, high-performance commercial seating for Aceray, featuring architectural technopolymer shells, wireframe bases, and versatile indoor/outdoor hospitality solutions.',
  },
  'da-design': {
    alias: 'ds-design',
  },
  'ds-designs': {
    alias: 'ds-design',
  },
}

const DESIGNER_NAME_MAP = {
  'da-design': 'DS-Design',
  'da design': 'DS-Design',
  'da-designs': 'DS-Design',
  'da designs': 'DS-Design',
  'ds-design': 'DS-Design',
  'ds design': 'DS-Design',
  'ds-designs': 'DS-Design',
  'ds designs': 'DS-Design',
  'glam by gualtiero ceschia': 'Gualtiero Ceschia',
  'flora-ceschia': 'Gualtiero Ceschia',
  'flora ceschia': 'Gualtiero Ceschia',
  'a & t studio': 'A & T Design',
  'a&t studio': 'A & T Design',
  'a & t design': 'A & T Design',
  'a&t design': 'A & T Design',
  'a and t studio': 'A & T Design',
  'a and t design': 'A & T Design',
  'carlesi/tonelli': 'Studio Carlesi/Tonelli',
  'cartesi e tonelli': 'Studio Carlesi/Tonelli',
  'carlessi/tonelli': 'Studio Carlesi/Tonelli',
  'calesi/tonelli': 'Studio Carlesi/Tonelli',
  'studio carlesi tonelli': 'Studio Carlesi/Tonelli',
  'tipi': 'Studio Tipi',
  'studio tipi': 'Studio Tipi',
  'ds-designs': 'DS-Design',
  'ds designs': 'DS-Design',
  'arter & citon': 'Arter & Citton',
  'o. fioravanti': 'Odo Fioravanti',
  'a. ciabatti': 'Aldo Ciabatti',
}

export function normalizeDesignerName(name = '') {
  if (!name) return ''
  const clean = String(name).replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
  const lowerKey = clean.toLowerCase()
  return DESIGNER_NAME_MAP[lowerKey] || clean
}

export function getDesignerSlug(value = '') {
  if (!value) return ''
  const normalized = normalizeDesignerName(value)
  if (!normalized) return ''
  return String(normalized)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getDesignerProfile(name = '') {
  if (!name) return null
  const key = getDesignerSlug(name)
  if (!key) return null
  const profile = DESIGNER_PROFILES[key]

  if (!profile) return null
  if (profile.alias) return DESIGNER_PROFILES[profile.alias] || null

  return profile
}
