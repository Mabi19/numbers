import { CSSResult, css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { baseDemo } from "./base-demo";
import { splitFPBits } from "./bits";
import { when } from "lit/directives/when.js";
import { formatGenericNumber, formatMantissa } from "./number-formatting";

@customElement("floating-point-demo")
export class FloatingPointDemo extends baseDemo({ bits: 32, types: ["naive" , "unique", "ieee754"] }) {
    static styles = [
        super.styles,
        css`
            .text-red {
                color: red;
            }

            .text-green {
                color: green;
            }

            .text-blue {
                color: #0078f0;
            }
        `
    ]

    renderBits() {
        return html`
            ${this.makeBitElements(this.bits.slice(0, 22), { class: "blue" })}
            ${this.type == "naive" ? html`<div class="bit virtual">.</div>` : nothing}
            ${this.makeBitElements(this.bits.slice(22, 23), { offset: 22, class: "blue" })}
            ${this.makeBitElements(this.bits.slice(23, 31), { offset: 23, class: "green" })}
            ${this.makeBitElements(this.bits.slice(31), { offset: 31, class: "red" })}
        `
    }

    convertFPDataToNumber(data: ReturnType<typeof splitFPBits>) {
        // check for 0 in unique format
        if (this.type == "unique" && data.exponent == -127 && data.mantissa == 0) {
            return { result: data.sign * 0, isSpecial: true }
        }

        if (this.type == "naive") {
            data.mantissa /= (2 ** 22);
        } else {
            data.mantissa /= (2 ** 23);
            data.mantissa += 1;
        }

        let result = data.sign * (2 ** data.exponent) * data.mantissa;

        return { result, isSpecial: false }
    }

    renderExtra() {
        // the formats share so much in common that combining the logic is simplest
        const data = splitFPBits(this.bits);

        const { result, isSpecial } = this.convertFPDataToNumber(data);

        return html`
            value: ${formatGenericNumber(result)}
            ${when(isSpecial,
                () => html`
                    (special)
                `,
                () => html`
                    (<math display="inline">
                        <mrow>
                            <mn>${formatGenericNumber(data.sign)}</mn>
                            <mo>&sdot;</mo>
                            <msup>
                                <mn>2</mn>
                                <mrow>
                                    <mn>${data.exponent}</mn>
                                </mrow>
                            </msup>
                            <mo>&sdot;</mo>
                            <mn>${formatMantissa(data.mantissa)}</mn>
                        </mrow>
                    </math>)
                `
            )}
            
        `
    }
}