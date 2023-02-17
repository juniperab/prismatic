/**
 * used algorithm is the YIQ color space algorithm. This algorithm uses the 
 * relative luminance values of a color to determine its contrast against a 
 * white background.
 * @param color 
 * @return string e.g. 'black'
 */

export function getContrastingColor(color: string): string {
    // Convert the color from hex to RGB
    const [r, g, b] = hexToRgb(color)!;

    // Convert the RGB color to the YIQ color space
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Return either black or white, depending on the YIQ value
    return (yiq >= 128) ? 'black' : 'white';
}

function hexToRgb(hex: string): number[] | null {
    // Extract the red, green, and blue values from the hex string
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

/**
 * In this example, the getContrastingColor function takes a color in the form 
 * of a hex string and converts it to the RGB color space using the hexToRgb 
 * function. Then, it uses the YIQ algorithm to calculate the relative luminance 
 * of the color and returns either 'black' or 'white' depending on the YIQ value.
 */