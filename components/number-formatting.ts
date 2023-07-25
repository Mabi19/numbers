function negativeSign(num: number) {
    // explicitly check for -0
    return (num < 0 || Object.is(num, -0)) ? "\u2212" : "";
}

function stripTrailingZeroes(num: string) {
    return num.replace(/\.?0+$/, "");
}

export function formatMantissa(num: number) {
    const fixedLength = num.toFixed(9);
    return stripTrailingZeroes(fixedLength);
}

export function formatGenericNumber(num: number) {
    let formatted = Math.abs(num).toPrecision(7);
    
    // strip trailing zeroes if there's a fractional part
    if (formatted.includes(".")) {
        // don't strip trailing zeroes from the exponent
        const parts = formatted.split("e");
        parts[0] = stripTrailingZeroes(parts[0]);
        // fancy minus
        formatted = parts.join("e").replace("-", "\u2212");
    }
    return negativeSign(num) + formatted;
}
