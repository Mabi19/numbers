import { customElement } from "lit/decorators.js";
import { bitsToInt, bitsToSignBitInt, bitsToUInt } from "./bits";
import { baseDemo } from "./base-demo";
import { html } from "lit";

@customElement("integer-demo")
export class IntegerDemo extends baseDemo({ bits: 8, types: ["unsigned", "twos-complement", "sign-bit", "shifted"] }) {
    static readonly bitsToNumberFuncs = {
        unsigned: bitsToUInt,
        "twos-complement": bitsToInt,
        "sign-bit": bitsToSignBitInt,
        shifted: (bits: boolean[]) => bitsToUInt(bits) - 0x80,
    }

    renderBits() {
        // color the top bit if the mode is sign bit
        const topBitClass = this.type == "sign-bit" ? "red" : undefined;
        return html`
            ${this.makeBitElements(this.bits.slice(0, 7))}
            ${this.makeBitElements(this.bits.slice(7), { class: topBitClass, offset: 7 })}
        `;
    }
}
