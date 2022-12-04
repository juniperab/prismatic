import * as _ from "lodash"

const updateExtraVh: () => void = _.throttle(() => {
    // N.B. this is a hack to handle 100vh not being the same as the visible window size on some mobile browsers
    // the CSS variable '--extra-vh' will be populated with the number of non-visible pixels included in
    // the 100vh height measurement. This value should change infrequently as the view is manipulated
    // on mobile browsers, whereas the actually number of pixels in 100vh will change frequently on desktop browsers
    // when the window is resized. Thus, the ideal way to calculate a viewport-relative height of Xvh in CSS is
    // calc(X / 100 * (100vh - var(--extra-vh, 0px))); This will ensure that resizing does not appear skippy as it
    // would if we were instead to define a custom unit equal to one 'effect' vh and update that continuously.
    const extraVh = window.document.body.clientHeight - window.innerHeight
    document.documentElement.style.setProperty('--extra-vh', `${extraVh}px`)
  },
  100
)

export function handleWindowResize(): void {
  updateExtraVh()
}

