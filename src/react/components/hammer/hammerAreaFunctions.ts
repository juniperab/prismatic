import { HammerAreaClamp, HammerAreaValues } from "./hammerAreaTypes";
import { defaultTo } from "lodash";
import { floatEquals } from "../../../lib/math/math";



/**
 * Clamp a value within the given bounds, if specified.
 *
 * @param value       the input value
 * @param clamp       the clamp to apply
 */
export function clampValue(value: number, clamp: HammerAreaClamp | undefined): number {
  if (clamp === undefined) return value
  if (clamp[0] !== undefined) {
    value = Math.max(value, clamp[0])
  }
  if (clamp[1] !== undefined) {
    value = Math.min(value, clamp[1])
  }
  return value
}

/**
 * Fill out a partial specification of HammerAreaValues with default values
 * for the unspecified properties.
 *
 * @param partialValues     a partial specification of HammerAreaValues
 * @param defaults          the default values to use
 */
export function withDefaults(
  partialValues: Partial<HammerAreaValues> = {},
  defaults: HammerAreaValues,
): HammerAreaValues {
  return {
    rotation: defaultTo(partialValues.rotation, defaults.rotation),
    scale: defaultTo(partialValues.scale, defaults.scale),
    x: defaultTo(partialValues.x, defaults.x),
    y: defaultTo(partialValues.y, defaults.y),
  }
}

/**
 * Determine whether two instances of HammerAreaValues are equal
 *
 * @param a   an instance of HammerAreaValues
 * @param b   another instance of HammerAreaValues
 */
export function valuesEquals(a: HammerAreaValues, b: HammerAreaValues): boolean {
  return floatEquals(a.rotation, b.rotation)
    && floatEquals(a.scale, b.scale)
    && floatEquals(a.x, b.x)
    && floatEquals(a.y, b.y)
}

/**
 * Return only those components of the new values that differ from the old values.
 *
 * @param oldValues   the old values to compare
 * @param newValues   the new values that may have changed
 */
export function valuesDiffs(oldValues: HammerAreaValues, newValues: HammerAreaValues): HammerAreaValues {
  return {
    rotation: newValues.rotation - oldValues.rotation,
    scale: newValues.scale - oldValues.scale,
    x: newValues.x - oldValues.x,
    y: newValues.y - oldValues.y,
  }
}
