import { customElement } from "lit/decorators.js";
import { bitsToInt, bitsToSignBitInt, bitsToUInt } from "./bits";
import { baseDemo } from "./base-demo";
import { html } from "lit";
import { formatGenericNumber } from "./number-formatting";

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

    renderExtra() {
        if (this.type != "shifted") {
            return super.renderExtra();
        } else {
            const numValue = IntegerDemo.bitsToNumberFuncs[this.type](this.bits);
            const formatted = formatGenericNumber(numValue);
            return html`= ${formatted} (<math display="inline">
                <mrow>
                    <mn>${formatGenericNumber(bitsToUInt(this.bits))}</mn>
                    <mo>&minus;</mo>
                    <mn>128</mn>
                </mrow>
            </math>)`
        }
    }
}
