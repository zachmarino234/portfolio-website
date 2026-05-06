import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'embedBlock',
  title: 'Embed (iframe)',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Short label for this embed (e.g. “Demo video”).',
    }),
    defineField({
      name: 'url',
      title: 'Embed URL',
      type: 'url',
      description:
        'Paste an embed URL (e.g. https://www.youtube.com/embed/..., Figma embed, etc.). Do not paste the full <iframe> HTML.',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https']})
          .required()
          .error('Please enter a valid https:// embed URL'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({title, url}) {
      return {
        title: title || 'Embed',
        subtitle: url || '',
      }
    },
  },
})
