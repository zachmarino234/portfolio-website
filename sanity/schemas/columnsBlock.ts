import {defineType, defineField} from 'sanity'
import {InlineIcon} from '@sanity/icons'


export default defineType({
  name: 'columnsBlock',
  title: 'Two-column block',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'leftHeading',
      title: 'Left heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'leftBody',
      title: 'Left text',
      type: 'array',
      of: [{type: 'block'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'leftQuote',
      title: 'Left quote (optional)',
      type: 'blockquote',
    }),
    defineField({
      name: 'rightImage',
      title: 'Right image block',
      type: 'imageBlock',
      description: 'Shown on the right side, like the image + caption in the design.',
    }),
  ],
  preview: {
    select: {
      title: 'leftHeading',
      media: 'rightImage.image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Two-column block',
        subtitle: 'Columns block',
        media,
      }
    },
  },
})
