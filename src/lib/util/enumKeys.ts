/**
 * Return a list of all the (strongly typed) keys of an enum
 * @param obj
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[]
}
