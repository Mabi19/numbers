import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { bitsToMovingPoint, MOVING_POINT_BITS, uintToBits } from "./bits";
import { bitStyles } from "./styles";

@customElement("moving-point-demo")
export class MovingPointDemo extends LitElement {
    @property({ converter: (str) => uintToBits(parseInt(str), 32), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0, 32);
    static styles = [
        bitStyles
    ]

    makeBitElements(bits: boolean[], offset: number = 0, extraClass: string | undefined = undefined) {
        return bits.map((val, idx) => html`
            <div class="bit ${extraClass}" @click="${() => this._toggleBit(idx + offset)}">${val ? 1 : 0}</div>
        `)
    }

    render() {
        const { pointPosition, value: numValue } = bitsToMovingPoint(this.bits);

        const pointPart = this.bits.slice(this.bits.length - MOVING_POINT_BITS);
        const integerPart = this.bits.slice(pointPosition, this.bits.length - MOVING_POINT_BITS);
        const fractionalPart = this.bits.slice(0, pointPosition);

        console.log(integerPart.length, fractionalPart.length);

        return html`
            <div>
                <div class="bits">
                    ${this.makeBitElements(fractionalPart, 0, "blue")}
                    <div class="bit">.</div>
                    ${this.makeBitElements(integerPart, fractionalPart.length, "red")}
                    ${this.makeBitElements(pointPart, integerPart.length + fractionalPart.length, "green")}
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