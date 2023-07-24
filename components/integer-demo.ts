import { customElement } from "lit/decorators.js";
import { bitsToInt, bitsToSignBitInt, bitsToUInt } from "./bits";
import { baseDemo } from "./base-demo";

@customElement("integer-demo")
export class IntegerDemo extends baseDemo({ bits: 8, types: ["unsigned", "twos-complement", "sign-bit", "shifted"] }) {
    static readonly bitsToNumberFuncs = {
        unsigned: bitsToUInt,
        "twos-complement": bitsToInt,
        "sign-bit": bitsToSignBitInt,
        shifted: (bits: boolean[]) => bitsToUInt(bits) - 0x80,
    }
}
