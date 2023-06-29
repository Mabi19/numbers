export function uintToBits(value: number) {
    const result: boolean[] = [];
    for (let i = 0; i < 32; i++) {
        // because of how two's complement works, we don't need to care about
        // signedness here
        result.push(Boolean(value & (1 << i)));
    }
    return result;
}

export function bitsToUInt(bits: boolean[]) {
    let result = 0;
    for (let i = 0; i < bits.length; i++) {
        // use exponentiation to not convert to 32-bit ints
        result += Number(bits[i]) * 2 ** i;
    }
    return result;
}

export function bitsToInt(bits: boolean[]) {
    let result = 0;
    for (let i = 0; i < bits.length; i++) {
        // use bitshifting to convert to a 32-bit int
        result += Number(bits[i]) * 1 << i;
    }
    return result;
}