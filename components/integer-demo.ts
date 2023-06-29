import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bitsToInt, bitsToSignBitInt, bitsToUInt, uintToBits } from "./bits";
import { bitStyles } from "./styles";

const bitsToNumberFuncs = {
    unsigned: bitsToUInt,
    signed: bitsToInt,
    "sign-bit": bitsToSignBitInt,
}

@customElement("integer-demo")
export class IntegerDemo extends LitElement {
    @property()
    type: "unsigned" | "signed" | "sign-bit";

    @property({ converter: (str) => uintToBits(parseInt(str)), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0);

    static styles = [
        bitStyles
    ]

    render() {
        const numValue = bitsToNumberFuncs[this.type](this.bits);

        return html`
            <div>
                <div class="bits">
                    ${this.bits.map((val, idx) => html`
                        <div class="bit" @click="${() => this._toggleBit(idx)}">${val ? 1 : 0}</div>
                    `)}
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
