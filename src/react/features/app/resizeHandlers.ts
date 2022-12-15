import * as _ from 'lodash'

export const updateExtraVh: () => void = _.throttle(() => {
  // N.B. this is a hack to handle 100vh not being the same as the visible window size on some mobile browsers
  // the CSS variable '--extra-vh' will be populated with the number of non-visible pixels included in
  // the 100vh height measurement. This value should change infrequently as the view is manipulated
  // on mobile browsers, whereas the actually number of pixels in 100vh will change frequently on desktop browsers
  // when the window is resized. Thus, the ideal way to calculate a viewport-relative height of Xvh in CSS is
  // calc(X / 100 * (100vh - var(--extra-vh, 0px))); This will ensure that resizing does not appear skippy as it
  // would if we were instead to define a custom unit equal to one 'effect' vh and update that continuously.
  const extraVh = window.document.body.clientHeight * 2 - window.innerHeight
  if (extraVh < 10) return // ignore very small adjustments; ignores desktop browser window resizing
  const currentExtraVh = parseFloat(document.documentElement.style.getPropertyValue('--extra-vh').slice(0, -2))
  if (extraVh > currentExtraVh) return // never increase the value; prevents swipe-down-to-reload from going all wonky
  document.documentElement.style.setProperty('--extra-vh', `${extraVh}px`)
}, 10)

export function handleWindowResize(): void {
  updateExtraVh()
}
