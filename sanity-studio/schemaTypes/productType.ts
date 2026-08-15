import {TrolleyIcon} from '@sanity/icons'
import {defineType, defineField, defineArrayMember} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'designer',
      title: 'Designer',
      type: 'string',
      description: 'Legacy raw designer label. Use Designer Reference for the normalized taxonomy.',
    }),
    defineField({
      name: 'designerRef',
      title: 'Designer Reference',
      type: 'reference',
      to: [{type: 'designer'}],
      description: 'Normalized designer document generated during migration.',
    }),
    defineField({
      name: 'madeIn',
      title: 'Made In',
      type: 'string',
      description: 'Country of manufacture, e.g. Italy',
    }),
    defineField({
      name: 'categories',
      title: 'Legacy Product Categories',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      readOnly: true,
      description: 'Raw WordPress category values kept for migration verification and current frontend compatibility.',
    }),
    defineField({
      name: 'tags',
      title: 'Legacy Product Tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      readOnly: true,
      description: 'Raw WordPress tag values kept for migration verification.',
    }),
    defineField({
      name: 'family',
      title: 'Collection',
      type: 'string',
      description: 'Normalized collection/family label derived from WordPress categories or title prefix.',
    }),
    defineField({
      name: 'familyRef',
      title: 'Collection Reference',
      type: 'reference',
      to: [{type: 'family'}],
      description: 'Normalized collection document generated during migration.',
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      description: 'Normalized commercial product category such as Side Chairs or Tables & Bases.',
    }),
    defineField({
      name: 'productTypeRef',
      title: 'Product Category Reference',
      type: 'reference',
      to: [{type: 'productCategory'}],
      description: 'Normalized product category document generated during migration.',
    }),
    defineField({
      name: 'materials',
      title: 'Materials / Construction',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Buyer-facing material and construction signals normalized from source taxonomy.',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Functional attributes such as Ready to Ship, Stacking, Swivel, Outdoor, or Sled.',
    }),
    defineField({
      name: 'legacyCategories',
      title: 'Legacy Categories Snapshot',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
      description: 'Migration snapshot of the original categories before normalization.',
    }),
    defineField({
      name: 'legacyTags',
      title: 'Legacy Tags Snapshot',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
      description: 'Migration snapshot of the original tags before normalization.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Highlight',
      type: 'boolean',
      description: 'Toggle ON to feature this product on the Homepage Featured Highlights section.',
      initialValue: false,
    }),

    // ── Images ──────────────────────────────────────────────
    defineField({
      name: 'mainImage',
      title: 'Main Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (external)',
      type: 'url',
      description:
        'Public URL of the product image (WordPress, Cloudflare R2, etc.). Used as fallback when mainImage is not uploaded to Sanity.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'isInstallation',
              title: 'Show in Installation Gallery?',
              type: 'boolean',
              initialValue: true,
              description: 'Toggle on to feature this photo in the Installation Gallery.',
            }),
            defineField({
              name: 'projectName',
              title: 'Project / Venue Name',
              type: 'string',
              description: 'e.g. Hilton Austin Dining Room, Marriott Marquis Chicago',
            }),
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'galleryUrls',
      title: 'Gallery Image URLs (external)',
      type: 'array',
      of: [defineArrayMember({type: 'url'})],
      description: 'External URLs for gallery images (WordPress migration).',
    }),
    defineField({
      name: 'productPdfs',
      title: 'Product PDFs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'PDF File',
              type: 'file',
              options: {
                accept: 'application/pdf',
              },
            }),
            defineField({
              name: 'sourceUrl',
              title: 'Original WordPress URL',
              type: 'url',
              readOnly: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'sourceUrl',
            },
          },
        },
      ],
      description: 'Product-specific PDF spec sheets migrated from WordPress.',
    }),
    defineField({
      name: 'technicalDrawings',
      title: 'Technical Drawings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'e.g. RIVA-3RSL Technical Drawing',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'File (DWG / PDF)',
              type: 'file',
              options: {
                accept: '.dwg,.pdf,.dxf',
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      description: 'CAD technical drawings (DWG, PDF, DXF) available for download.',
    }),
    defineField({
      name: 'files3d',
      title: '3D Files',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'e.g. RIVA-3RSL 3DS Max File',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'File (STEP / OBJ / SKP / 3DS / etc.)',
              type: 'file',
              options: {
                accept: '.step,.stp,.obj,.skp,.3ds,.fbx,.iges,.igs,.stl',
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      description: '3D model files (STEP, OBJ, SKP, etc.) available for download.',
    }),
    defineField({
      name: 'zipFiles',
      title: 'Archive / ZIP Files',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'e.g. RIVA-3RSL Revit File',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'File (ZIP / RAR)',
              type: 'file',
              options: {
                accept: '.zip,.rar,.7z',
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      description: 'Archive/zip files (Revit, BIM, etc.) available for download.',
    }),

    // ── Curated product relationships ─────────────────────
    defineField({
      name: 'fromThisCollection',
      title: 'From This Collection',
      type: 'array',
      description: 'Ordered product references imported from WordPress ACF from_this_collection.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'youMayAlsoLike',
      title: 'You May Also Like',
      type: 'array',
      description: 'Ordered product references imported from WordPress ACF you_may_also_like.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
    }),
    defineField({
      name: 'legacyRelatedProductIds',
      title: 'Legacy Related Product IDs',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({
          name: 'fromThisCollection',
          title: 'From This Collection WP IDs',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
        }),
        defineField({
          name: 'youMayAlsoLike',
          title: 'You May Also Like WP IDs',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
        }),
      ],
    }),

    // ── Description ─────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description / Specifications',
      type: 'text',
    }),

    // ── Dimensions & Weight ─────────────────────────────────
    defineField({
      name: 'overallHeight',
      title: 'Overall Height (in)',
      type: 'string',
    }),
    defineField({
      name: 'overallWidth',
      title: 'Overall Width (in)',
      type: 'string',
    }),
    defineField({
      name: 'overallDepth',
      title: 'Overall Depth (in)',
      type: 'string',
    }),
    defineField({
      name: 'seatHeight',
      title: 'Seat Height (in)',
      type: 'string',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (lbs)',
      type: 'string',
    }),

    // ── Specifications ──────────────────────────────────────
    defineField({
      name: 'com',
      title: 'COM (yards)',
      type: 'string',
      description: "Customer's Own Material yardage",
    }),
    defineField({
      name: 'stacking',
      title: 'Stacking',
      type: 'string',
      description: 'e.g. No, Yes, 4-high',
    }),

    // ── Flags ───────────────────────────────────────────────
    defineField({
      name: 'isNewArrival',
      title: 'Is New Arrival / Hero Highlight?',
      type: 'boolean',
      initialValue: false,
    }),

    // ── WordPress migration reference ───────────────────────
    defineField({
      name: 'wpPostId',
      title: 'WordPress Post ID (migration)',
      type: 'number',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'designer',
      media: 'mainImage',
    },
  },
})
