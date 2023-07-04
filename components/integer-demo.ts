import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bitsToInt, bitsToSignBitInt, bitsToUInt, uintToBits } from "./bits";
import { bitStyles } from "./styles";

const bitsToNumberFuncs = {
    unsigned: bitsToUInt,
    "twos-complement": bitsToInt,
    "sign-bit": bitsToSignBitInt,
    shifted: (bits: boolean[]) => bitsToUInt(bits) - 0x80,
}

@customElement("integer-demo")
export class IntegerDemo extends LitElement {
    @property()
    type: "unsigned" | "twos-complement" | "sign-bit" | "shifted";

    @property({ converter: (str) => uintToBits(parseInt(str)), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0);

    @property({ type: Boolean })
    locked: boolean = false;

    static styles = [
        bitStyles
    ]

    render() {
        const numValue = bitsToNumberFuncs[this.type](this.bits);

        return html`
            <div>
                <div class="bits ${this.locked ? 'locked' : undefined}">
                    ${this.bits.map((val, idx) => html`
                        <div class="bit" @click="${() => this._toggleBit(idx)}">${val ? 1 : 0}</div>
                    `)}
                </div>
                value: ${numValue}
            </div>
        `;
    }

    private _toggleBit(idx: number) {
        if (!this.locked) {
            this.bits[idx] = !this.bits[idx]
            this.requestUpdate();
        }
    }
}
