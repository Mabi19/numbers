import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { uintToBits } from "./bits";
import { bitStyles } from "./styles";

export interface BaseDemoOptions<Types extends string[]> {
    bits: number;
    types: Types;
}

export function baseDemo<Types extends string[]>(options: BaseDemoOptions<Types>) {
    abstract class BaseDemo extends LitElement {
        @property()
        type: Types[number];
    
        static readonly bitsToNumberFuncs: { [T in Types[number]]: (bits: boolean[]) => number };
        static readonly BIT_COUNT = options.bits;
    
        @property({ converter: (str) => uintToBits(parseInt(str), options.bits), type: Array, attribute: "value" })
        bits: boolean[] = uintToBits(0, options.bits);
    
        @property({ type: Boolean })
        locked: boolean = false;
    
        static styles = [
            bitStyles
        ]

        renderBits() {
            return this.bits.map((val, idx) => html`
                <div class="bit" @click="${() => this.toggleBit(idx)}">${val ? 1 : 0}</div>
            `)
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
