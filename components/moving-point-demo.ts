import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { bitsToMovingPoint, MOVING_POINT_BITS, splitMovingPoint } from "./bits";
import { baseDemo } from "./base-demo";
import { formatGenericNumber } from "./number-formatting";

@customElement("moving-point-demo")
export class MovingPointDemo extends baseDemo({ bits: 32, types: ["simple", "hypervalues"] }) {
    renderBits() {
        const parts = splitMovingPoint(this.bits);

        // where to draw the point
        const renderPointPosition = 27 - Math.min(27, parts.pointPosition);

        const pointPart = this.bits.slice(this.bits.length - MOVING_POINT_BITS);
        const integerPart = this.bits.slice(renderPointPosition, this.bits.length - MOVING_POINT_BITS);
        const fractionalPart = this.bits.slice(0, renderPointPosition);

        return html`
            ${when(parts.virtualZeroes == 0 || this.type == "hypervalues", () => html`
                ${this.makeBitElements(fractionalPart, { class: "blue" })}
                <div class="bit virtual">.</div>
                ${this.makeBitElements(new Array(parts.virtualZeroes).fill(false), { locked: true, class: "gray virtual" })}
            `)}
            ${this.makeBitElements(integerPart, { offset: fractionalPart.length, class: "red"})}
            ${this.makeBitElements(pointPart, { offset: integerPart.length + fractionalPart.length, class: "green" })}
        `
    }

    renderExtra() {
        const { virtualZeroes, value } = bitsToMovingPoint(splitMovingPoint(this.bits));
        return html`
            =
            ${when(virtualZeroes == 0 || this.type == "hypervalues",
                () => html`${formatGenericNumber(value)}`,
                () => html`?`
            )}
        `
    }
}
