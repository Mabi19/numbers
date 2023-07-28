import { LitElement, TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { uintToBits } from "./bits";
import { bitStyles } from "./bit-styles";
import { formatGenericNumber } from "./number-formatting";

export interface BaseDemoOptions<Types extends readonly string[]> {
    readonly bits: number;
    readonly types: Types;
}

export interface BitElementsOptions {
    offset?: number;
    class?: string;
    locked?: boolean;
}

export function baseDemo<const Types extends readonly string[]>(options: BaseDemoOptions<Types>) {
    abstract class BaseDemo extends LitElement {
        @property()
        type: Types[number] = options.types[0];
    
        static readonly bitsToNumberFuncs: { [T in Types[number]]: (bits: boolean[]) => number };
        static readonly BIT_COUNT = options.bits;
    
        @property({ converter: (str) => uintToBits(parseInt(str), options.bits), type: Array, attribute: "value" })
        bits: boolean[] = uintToBits(0, options.bits);
    
        @property({ type: Boolean })
        locked: boolean = false;
    
        static styles: any[] = [
            bitStyles
        ]

        makeBitElements(bits: boolean[], options: BitElementsOptions = {}): TemplateResult | TemplateResult[] {
            const offset = options.offset ?? 0;
            return bits.map((val, idx) => html`
                <div
                    class="bit ${options.class} ${(this.locked || options.locked) ? 'locked' : undefined}"
                    @click=${!options.locked ? () => this.toggleBit(idx + offset) : nothing}
                >${val ? 1 : 0}</div>
            `)
        }

        renderBits() {
            return this.makeBitElements(this.bits)
        }

        renderExtra() {
            const numValue = (this.constructor as typeof BaseDemo).bitsToNumberFuncs[this.type](this.bits);
            return html`value: ${formatGenericNumber(numValue)}`
        }
    
        render() {
            return html`
                <!-- TODO: lock icon when demo is locked -->
                <!-- TODO: value presets -->
                <div class="demo">
                    <div class="bits ${this.locked ? 'locked' : undefined}">
                        ${this.renderBits()}
                    </div>
                    <div class="extra">
                        ${this.renderExtra()}
                    </div>
                </div>
            `;
        }
    
        protected toggleBit(idx: number) {
            if (!this.locked) {
                this.bits[idx] = !this.bits[idx]
                this.requestUpdate();
            }
        }
    }
    return BaseDemo;
}
