import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { baseDemo } from "./base-demo";
import { splitFPBits } from "./bits";
import { when } from "lit/directives/when.js";
import { formatGenericNumber, formatMantissa } from "./number-formatting";

@customElement("floating-point-demo")
export class FloatingPointDemo extends baseDemo({
    bits: 32,
    types: ["naive" , "unique", "subnormals", "large-sentinel", "infinities", "ieee754"]
}) {
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
        // check for top exponent in full format
        if (this.type == "ieee754" && data.exponent == 128) {
            let result: number;
            if (data.mantissa == 0) {
                result = data.sign * Infinity;
            } else {
                result = NaN;
            }
            return { result, isSpecial: true }
        }

        // check for 0 in unique format
        if (this.type == "unique" && data.exponent == -127 && data.mantissa == 0) {
            return { result: data.sign * 0, isSpecial: true }
        }
        // check for infinities in the naive infinities formats
        if ((this.type == "large-sentinel" || this.type == "infinities") && data.exponent == 128 && data.mantissa == 0x7fffff) {
            return { result: data.sign * Infinity, isSpecial: true }
        }

        if (this.type == "naive") {
            data.mantissa /= (2 ** 22);
        } else {
            data.mantissa /= (2 ** 23);

            // subnormals: on lowest exponent, increase it by one but leave out the mantissa's starting 1
            if (["subnormals", "large-sentinel", "infinities", "ieee754"].includes(this.type) && data.exponent == -127) {
                data.exponent = -126;
            } else {
                data.mantissa += 1;
            }
        }

        let result = data.sign * (2 ** data.exponent) * data.mantissa;

        return { result, isSpecial: false }
    }

    renderExtra() {
        // the formats share so much in common that combining the logic is simplest
        const data = splitFPBits(this.bits);

        const { result, isSpecial } = this.convertFPDataToNumber(data);

        // display a placeholder when the too-large sentinel hasn't been named yet
        if (this.type == "large-sentinel" && isSpecial) {
            // +/-inf is the only special value in this mode
            return html`= ${when(result < 0, () => html`&#x2212`)}[too large] (special)`;
        }

        return html`
            = ${formatGenericNumber(result)}
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
                                <mn>${data.exponent}</mn>
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