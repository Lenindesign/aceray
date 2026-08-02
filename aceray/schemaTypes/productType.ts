import {defineType, defineField} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
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
      description: 'e.g. Maurizio Zilio, Studio Carlesi/Tonelli',
    }),
    defineField({
      name: 'madeIn',
      title: 'Made In',
      type: 'string',
      description: 'Country of manufacture, e.g. Italy',
    }),
    defineField({
      name: 'categories',
      title: 'Product Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'e.g. Side Chairs, Armchairs, Lounge Seating',
    }),
    defineField({
      name: 'tags',
      title: 'Product Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
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
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'galleryUrls',
      title: 'Gallery Image URLs (external)',
      type: 'array',
      of: [{type: 'url'}],
      description: 'External URLs for gallery images (WordPress migration).',
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
