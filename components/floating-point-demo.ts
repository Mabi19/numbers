import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { bitsToMovingPoint, MOVING_POINT_BITS, uintToBits } from "./bits";
import { bitStyles } from "./styles";

@customElement("floating-point-demo")
export class FloatingPointDemo extends LitElement {
    @property({ converter: (str) => uintToBits(parseInt(str), 32), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0, 32);

    @property({ type: String })
    type: "naive" = "naive";

    static styles = [
        bitStyles
    ];

    makeBitElements(bits: boolean[], options: Partial<{ offset: number, locked: boolean, extraClass: string}>) {
        const offset = options.offset ?? 0;

        return bits.map((val, idx) => html`
            <div
                class="bit ${options.extraClass} ${options.locked ? 'locked' : undefined}"
                @click=${!options.locked ? () => this._toggleBit(idx + offset) : nothing}
            >${val ? 1 : 0}</div>
        `)
    }

    render() {
        return html`<p>TODO: floating point demo (${this.type})</p>`
    }

    private _toggleBit(idx: number) {
        this.bits[idx] = !this.bits[idx]
        this.requestUpdate();
    }
}