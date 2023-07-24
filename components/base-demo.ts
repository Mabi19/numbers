import { LitElement, TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { uintToBits } from "./bits";
import { bitStyles } from "./styles";

export interface BaseDemoOptions<Types extends string[]> {
    bits: number;
    types: Types;
}

export interface BitElementsOptions {
    offset?: number;
    class?: string;
}

export function baseDemo<Types extends string[]>(options: BaseDemoOptions<Types>) {
    abstract class BaseDemo extends LitElement {
        @property()
        type: Types[number] = options.types[0];
    
        static readonly bitsToNumberFuncs: { [T in Types[number]]: (bits: boolean[]) => number };
        static readonly BIT_COUNT = options.bits;
    
        @property({ converter: (str) => uintToBits(parseInt(str), options.bits), type: Array, attribute: "value" })
        bits: boolean[] = uintToBits(0, options.bits);
    
        @property({ type: Boolean })
        locked: boolean = false;
    
        static styles = [
            bitStyles
        ]

        makeBitElements(bits: boolean[], options: BitElementsOptions = {}): TemplateResult | TemplateResult[] {
            const offset = options.offset ?? 0;
            return bits.map((val, idx) => html`
                <div class="bit ${options.class}" @click="${() => this.toggleBit(idx + offset)}">${val ? 1 : 0}</div>
            `)
        }

        renderBits() {
            return this.makeBitElements(this.bits)
        }
    
        render() {
            const numValue = (this.constructor as typeof BaseDemo).bitsToNumberFuncs[this.type](this.bits);
    
            return html`
                <div>
                    <div class="bits ${this.locked ? 'locked' : undefined}">
                        ${this.renderBits()}
                    </div>
                    value: ${numValue}
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
