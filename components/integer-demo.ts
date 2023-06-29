import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bitsToInt, bitsToUInt, uintToBits } from "./bits";
import { bitStyles } from "./styles";

@customElement("integer-demo")
export class IntegerDemo extends LitElement {
    @property()
    type: "unsigned" | "signed";

    @property({ converter: (str) => uintToBits(parseInt(str)), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0);

    static styles = [
        bitStyles
    ]

    render() {
        const numValue = this.type == "unsigned" ? bitsToUInt(this.bits) : bitsToInt(this.bits);

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
