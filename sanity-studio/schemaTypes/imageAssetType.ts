import {defineType, defineField} from 'sanity'

export const imageAssetType = defineType({
  name: 'sanity.imageAsset',
  title: 'Image Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'isInstallation',
      title: 'Show in Installation Gallery?',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle ON to feature this asset in the Installation Gallery.',
    }),
    defineField({
      name: 'projectName',
      title: 'Project / Venue Name',
      type: 'string',
      description: 'e.g. Hilton Austin Lounge, Marriott Marquis Chicago',
    }),
  ],
})
