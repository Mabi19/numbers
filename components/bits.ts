export function uintToBits(value: number, bitCount: number) {
    const result: boolean[] = [];
    for (let i = 0; i < bitCount; i++) {
        result.push(Boolean(value & (2 ** i)));
    }
    return result;
}

export function bitsToUInt(bits: boolean[]) {
    let result = 0;
    for (let i = 0; i < bits.length; i++) {
        result += Number(bits[i]) * 2 ** i;
    }
    return result;
}

export function bitsToInt(bits: boolean[]) {
    let result = 0;
    for (let i = 0; i < bits.length; i++) {
        let summand = Number(bits[i]) * 1 << i;
        // flip it if it's supposed to be negative
        if (i == bits.length - 1)
            summand *= -1;

        result += summand;
    }
    return result;
}

export function bitsToSignBitInt(bits: boolean[]) {
    let result = 0;
    for (let i = 0; i < bits.length - 1; i++) {
        // we have a custom negative implementation so we don't need to care about
        // the built-in two's complement
        result += Number(bits[i]) * 1 << i;
    }
    // manually set the sign
    // do not flip if zero; we don't want to reveal -0
    return result * ((result != 0 && bits.at(-1)) ? -1 : 1);
}

export function bitsToFixedPoint(bits: boolean[]) {
    return bitsToUInt(bits) / (2 ** Math.floor(bits.length / 2));
}


export const MOVING_POINT_BITS = 5;
interface MovingPointParts {
    pointPositionBits: boolean[];
    virtualZeroes: number;
    pointPosition: number;
    valueBits: boolean[];
}

export function splitMovingPoint(bits: boolean[]): MovingPointParts {
    // extract the parts
    const pointPositionBits = bits.slice(bits.length - MOVING_POINT_BITS);
    const pointPosition = bitsToUInt(pointPositionBits);
    const valueBits = bits.slice(0, bits.length - MOVING_POINT_BITS);

    return {
        pointPositionBits,
        virtualZeroes: Math.max(0, bitsToUInt(pointPositionBits) - 27),
        pointPosition,
        valueBits
    }
}

export function bitsToMovingPoint(parts: MovingPointParts) {
    const rawValue = bitsToUInt(parts.valueBits);

    return { virtualZeroes: parts.virtualZeroes, value: rawValue / (2 ** (27 - parts.pointPosition)) }
}


export function splitFPBits(bits: boolean[]) {
    if (bits.length != 32) throw new TypeError("Floating point format must use 32 bits");

    // the mantissa's interpretation changes depending on the mode,
    // so we can't return it in fixed point directly
    return {
        sign: bits[31] ? -1 : 1,
        exponent: bitsToUInt(bits.slice(23, 31)) - 127,
        mantissa: bitsToUInt(bits.slice(0, 23)),
    }
}