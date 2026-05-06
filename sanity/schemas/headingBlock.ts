import {defineType, defineField} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

export default defineType({
  name: 'headingBlock',
  title: 'Heading',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Heading',
        subtitle: 'Heading block',
      }
    },
  },
})
