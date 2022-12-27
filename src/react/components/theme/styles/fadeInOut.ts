export function fadeInOut(show: any, inSpeed: number, outSpeed: number): string {
  // eslint-disable-next-line no-undef-init
  let _show: boolean | undefined = undefined
  if (typeof show === 'boolean') _show = show
  if (typeof show === 'object') _show = show['data-show']
  if (show === undefined) throw new Error("invalid type for 'show' parameter")
  return _show ?? false
    ? `
          visibility: visible;
          opacity: 1;
          transition: opacity ${inSpeed}s linear;
          `
    : `
          visibility: hidden;
          opacity: 0;
          transition: visibility 0s ${outSpeed}s, opacity ${outSpeed}s linear;
          `
}
