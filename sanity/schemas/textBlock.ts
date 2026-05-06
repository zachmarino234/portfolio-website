import {defineType, defineField, defineArrayMember} from 'sanity'
import {TextIcon} from '@sanity/icons'

export default defineType({
  name: 'textBlock',
  title: 'Text block',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Heading (optional)',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      hasTitle: 'title',
    },
    prepare({title, hasTitle}) {
      return {
        title: hasTitle ? title : 'Text block',
        subtitle: hasTitle ? 'Text block' : undefined,
      }
    },
  },
})
