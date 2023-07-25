import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { bitsToMovingPoint, MOVING_POINT_BITS } from "./bits";
import { baseDemo } from "./base-demo";
import { formatGenericNumber } from "./number-formatting";

@customElement("moving-point-demo")
export class MovingPointDemo extends baseDemo({ bits: 32, types: ["simple", "hypervalues"] }) {
    render() {
        // due to the bits shifting around we have to just render everything directly
        const { pointPosition, virtualZeroes, value: numValue } = bitsToMovingPoint(this.bits);

        const pointPart = this.bits.slice(this.bits.length - MOVING_POINT_BITS);
        const integerPart = this.bits.slice(pointPosition, this.bits.length - MOVING_POINT_BITS);
        const fractionalPart = this.bits.slice(0, pointPosition);

        console.log(integerPart.length, fractionalPart.length);


        return html`
            <div>
                <div class="bits">
                    ${this.makeBitElements(fractionalPart, { class: "blue" })}
                    <div class="bit virtual">.</div>
                    ${this.makeBitElements(new Array(virtualZeroes).fill(false), { locked: true, class: "gray virtual" })}
                    ${this.makeBitElements(integerPart, { offset: fractionalPart.length, class: "red"})}
                    ${this.makeBitElements(pointPart, { offset: integerPart.length + fractionalPart.length, class: "green" })}
                </div>
                value:
                ${when(virtualZeroes == 0 || this.type == "hypervalues",
                    () => html`${formatGenericNumber(numValue)}`,
                    () => html`?`
                )}
            </div>
        `;
    }
}