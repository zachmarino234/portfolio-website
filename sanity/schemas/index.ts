import {type SchemaTypeDefinition} from 'sanity'
import project from './project'
import imageBlock from './imageBlock'
import blockquote from './blockquote'
import headingBlock from './headingBlock'
import textBlock from './textBlock'
import carouselBlock from './carouselBlock'
import columnsBlock from './columnsBlock'
import embedBlock from './embedBlock'

export const schemaTypes: SchemaTypeDefinition[] = [
  project,
  // Reusable blocks
  imageBlock,
  blockquote,
  headingBlock,
  textBlock,
  carouselBlock,
  columnsBlock,
  embedBlock,
]