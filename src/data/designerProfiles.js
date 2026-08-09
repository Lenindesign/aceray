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
  'arter-citton': {
    location: 'Italy',
    disciplines: ['Furniture', 'Contract seating', 'Product design'],
    bio: 'Arter & Citton is represented in Aceray through upholstered seating families designed for hospitality and contract environments, with an emphasis on clean silhouettes, comfort, and configurable commercial use.',
  },
}

export function getDesignerSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getDesignerProfile(name = '') {
  const key = getDesignerSlug(name)
  const profile = DESIGNER_PROFILES[key]

  if (!profile) return null
  if (profile.alias) return DESIGNER_PROFILES[profile.alias] || null

  return profile
}
