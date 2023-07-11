const INTEGER_BITS = 8;

export function uintToBits(value: number, bitCount: number = -1) {
    if (bitCount == -1)
        bitCount = INTEGER_BITS;

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
        if (i == INTEGER_BITS - 1)
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
    return result * (bits.at(-1) ? -1 : 1);
}

export function bitsToFixedPoint(bits: boolean[]) {
    return bitsToUInt(bits) / (2 ** Math.floor(bits.length / 2));
}

export const MOVING_POINT_BITS = 5;
export function bitsToMovingPoint(bits: boolean[]) {
    // extract the parts
    const pointPositionBits = bits.slice(bits.length - MOVING_POINT_BITS);
    const pointPosition = bitsToUInt(pointPositionBits);
    const valueBits = bits.slice(0, bits.length - MOVING_POINT_BITS);
    const rawValue = bitsToUInt(valueBits);

    return { pointPosition, value: rawValue / (2 ** (pointPosition)) }
}
