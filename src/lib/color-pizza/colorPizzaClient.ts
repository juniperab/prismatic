import { AnyColour, NamedColour, RGBColour } from '../colour/colours'
import { toHex, withAlpha } from '../colour/colourConversions'
import { isFetchError, typedFetch } from '../fetch/typedFetch'

const colorPizzaBaseUri = 'https://api.color.pizza/v1'

interface LookupNamedColourResponse {
  paletteTitle: string
  colors: LookupNamedColourResponseItem[]
}

interface LookupNamedColourResponseItem {
  name: string
  rgb: RGBColour
}

export async function lookupColourName(colour: AnyColour): Promise<NamedColour | undefined> {
  const hex: string = toHex(withAlpha(colour, undefined)).slice(1, 7).toLowerCase()
  const uri: string = `${colorPizzaBaseUri}/?values=${encodeURIComponent(hex)}`
  const response = await typedFetch<LookupNamedColourResponse>(uri)
  if (isFetchError(response)) {
    console.log(`lookupColourName(${hex}): Error ${response.error.status} -- ${response.error.message}`)
    return undefined
  }
  const item = response.colors[0]
  if (item === undefined) {
    console.log(`lookupColourName(${hex}): No colours returned`)
    return undefined
  }
  return {
    name: item.name,
    hex: toHex(item.rgb),
  }
}
