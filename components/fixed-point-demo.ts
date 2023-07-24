import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { bitsToFixedPoint } from "./bits";
import { baseDemo } from "./base-demo";

@customElement("fixed-point-demo")
export class FixedPointDemo extends baseDemo({ bits: 32, types: ["fixed-point"] }) {
    static readonly bitsToNumberFuncs = { 
        "fixed-point": bitsToFixedPoint
    }

    renderBits() {
        const fractionalPart = this.bits.slice(0, this.bits.length / 2);
        const integerPart = this.bits.slice(this.bits.length / 2);

        return html`
            ${this.makeBitElements(fractionalPart, { offset: 0, class: "blue" })}
            <div class="bit virtual">.</div>
            ${this.makeBitElements(integerPart, { offset: 16, class: "red" })}
        `
    }
}
