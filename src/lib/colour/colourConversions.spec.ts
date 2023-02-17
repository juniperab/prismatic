import { toCssColour } from './colourConversions'

describe('toCssColour', () => {
  it('formats an HSBColour as hsl', () => {
    const cssColour = toCssColour({ h: 50, s: 50, b: 50 })
    expect(cssColour).toEqual('hsl(50.0, 33.0%, 38.0%)')
  })

  it('formats a HexColour as hex', () => {
    const cssColour = toCssColour('#1234AB')
    expect(cssColour).toEqual('#1234AB')
  })

  it('formats a NamedColour as hex', () => {
    const cssColour = toCssColour({ name: 'Made-up Colour', hex: '#ABABAB' })
    expect(cssColour).toEqual('#ABABAB')
  })
})
