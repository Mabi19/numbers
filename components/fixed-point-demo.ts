import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bitsToFixedPoint, uintToBits } from "./bits";
import { bitStyles } from "./styles";

@customElement("fixed-point-demo")
export class FixedPointDemo extends LitElement {

    @property({ converter: (str) => uintToBits(parseInt(str), 32), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0, 32);
    static styles = [
        bitStyles
    ]

    makeBitElements(bits: boolean[], offset: number = 0) {
        return bits.map((val, idx) => html`
            <div class="bit" @click="${() => this._toggleBit(idx + offset)}">${val ? 1 : 0}</div>
        `)
    }

    render() {
        const numValue = bitsToFixedPoint(this.bits);
        const integerPart = this.bits.slice(0, this.bits.length / 2);
        const fractionalPart = this.bits.slice(this.bits.length / 2);

        return html`
            <div>
                <div class="bits">
                    ${this.makeBitElements(integerPart)}
                    <div class="bit">.</div>
                    ${this.makeBitElements(fractionalPart, 16)}
                </div>
                value: ${numValue}
            </div>
        `;
    }

    private _toggleBit(idx: number) {
        this.bits[idx] = !this.bits[idx]
        this.requestUpdate();
    }
}
