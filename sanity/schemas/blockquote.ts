// schemaTypes/blockquote.ts
import {defineType, defineField} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'

export default defineType({
  name: 'blockquote',
  title: 'Blockquote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
    }),
  ],
})