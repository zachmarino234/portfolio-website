import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // Basic Info (also used for home page card)
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'This title appears in the one-pager and on the home page project card.',
    }),
    defineField({
      name: 'deliverableName',
      title: 'Deliverable name',
      type: 'string',
      validation: (rule) => rule.required(),
      description:
        'Short name of the final deliverable (e.g., “Fantasy Sportsball”). This is separate from the longer project title.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    // Hero / background image (also used as card hero)
    defineField({
      name: 'heroImage',
      title: 'Background / hero image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
      description:
        'Used as the full-bleed background on the project page and as the hero image on the home page project card.',
    }),
    defineField({
      name: 'hoverVideo',
      title: 'Card hover video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description:
        'Optional. Plays on the home page project card when hovered. The hero image is shown as the poster/fallback. Keep it short, muted, and lightweight (e.g. a looping mp4).',
    }),
    defineField({
      name: 'cardTags',
      title: 'Card tags',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(3).max(3),
      description:
        'Exactly three short tags shown on the home page project card.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description:
        'Short description shown on the home page project card and in any listings. Also safe to reuse for SEO.',
    }),
    defineField({
      name: 'cardColor',
      title: 'Card / theme color',
      type: 'color',
      options: {disableAlpha: true},
      description:
        'Background color of the home page project card. Its hue also seeds the color theme for the project page. Leave blank to fall back to the default dark card.',
    }),

    // One-pager (fixed structure shown at top of every project)
    defineField({
      name: 'brief',
      title: 'Design brief',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
      description: 'Full design brief – can include multiple paragraphs.',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
      description: 'Where/when the project took place.',
    }),
    defineField({
      name: 'toolsAndMethods',
      title: 'Tools & methods',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'toolsAndMethodsGroup',
          fields: [
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              description: 'e.g., “Research & Synthesis”, “Prototyping”.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
              validation: (rule) => rule.min(1),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'team',
      title: 'Team members',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
      description: 'List of team member names (e.g., “Zach Marino — Creator”).',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., “6 weeks”.',
    }),

    // Additional one-pager sections in the design
    defineField({
      name: 'insights',
      title: 'Insights',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      validation: (rule) => rule.required().min(1),
    }),

    // Flexible content blocks below the one-pager
    defineField({
      name: 'content',
      title: 'Page content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{name: 'href', type: 'url', title: 'URL'}],
              },
            ],
          },
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        }),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'carouselBlock'}),
        defineArrayMember({type: 'columnsBlock'}),
        defineArrayMember({type: 'embedBlock'}),
      ],
    }),

    defineField({
      name: 'orderRank',
      title: 'Order',
      type: 'number',
      description: 'Order in which projects appear (lower numbers first).',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
})