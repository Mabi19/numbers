import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { bitsToMovingPoint, MOVING_POINT_BITS, uintToBits } from "./bits";
import { bitStyles } from "./styles";

@customElement("moving-point-demo")
export class MovingPointDemo extends LitElement {
    @property({ converter: (str) => uintToBits(parseInt(str), 32), type: Array, attribute: "value" })
    bits: boolean[] = uintToBits(0, 32);

    @property({ type: Boolean })
    hypervalues: boolean = false;

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
        const { pointPosition, virtualZeroes, value: numValue } = bitsToMovingPoint(this.bits);

        const pointPart = this.bits.slice(this.bits.length - MOVING_POINT_BITS);
        const integerPart = this.bits.slice(pointPosition, this.bits.length - MOVING_POINT_BITS);
        const fractionalPart = this.bits.slice(0, pointPosition);

        console.log(integerPart.length, fractionalPart.length);

        return html`
            <div>
                <div class="bits">
                    ${this.makeBitElements(fractionalPart, { extraClass: "blue" })}
                    <div class="bit virtual">.</div>
                    ${this.makeBitElements(new Array(virtualZeroes).fill(false), { locked: true, extraClass: "gray virtual" })}
                    ${this.makeBitElements(integerPart, { offset: fractionalPart.length, extraClass: "red"})}
                    ${this.makeBitElements(pointPart, { offset: integerPart.length + fractionalPart.length, extraClass: "green" })}
                </div>
                value:
                ${when(virtualZeroes == 0 || this.hypervalues,
                    () => html`${numValue}`,
                    () => html`?`
                )}
            </div>
        `;
    }

    private _toggleBit(idx: number) {
        this.bits[idx] = !this.bits[idx]
        this.requestUpdate();
    }
}