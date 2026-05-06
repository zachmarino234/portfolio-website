import {defineType, defineField, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export default defineType({
  name: 'carouselBlock',
  title: 'Carousel',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'imageBlock'})],
      validation: (rule) => rule.min(1).required(),
      description:
        'Images shown in the carousel. Each image can have alt text and an optional caption.',
    }),
  ],
  preview: {
    select: {
      imageCount: 'images.length',
      firstImage: 'images.0.image',
    },
    prepare({imageCount, firstImage}) {
      return {
        title: 'Carousel',
        subtitle: imageCount ? `${imageCount} image${imageCount === 1 ? '' : 's'}` : 'No images',
        media: firstImage,
      }
    },
  },
})
