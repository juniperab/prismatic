import { isHex } from './colourHex'

export type KeywordColour = string // any CSS colour name string (will never include spaces)

export function isKeyword(colour: any): colour is KeywordColour {
  if (isHex(colour)) return false
  if (colour === undefined || typeof colour !== 'string') return false
  return colour.length > 0 && !colour.includes(' ')
}
