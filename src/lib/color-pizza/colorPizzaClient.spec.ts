import { lookupColourName } from './colorPizzaClient'
import { HexColour } from '../colour/colours'
import { toHex } from '../colour/colourConversions'

describe('color pizza client', () => {
  jest.setTimeout(10000)
  it('should look up a name for a hex colour', async () => {
    const colour: HexColour = toHex('#ABFECD')
    const namedColour = await lookupColourName(colour)
    expect(namedColour).toEqual({ hex: '#AAFFCC', name: 'Neo Mint' })
  })
  it('fails to look up a name for a malformed hex colour', async () => {
    const namedColour = await lookupColourName('#XYZXYZ' as HexColour)
    expect(namedColour).toBeUndefined()
  })
})
