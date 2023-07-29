import { LitElement, PropertyValues, TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { bitsToUInt, uintToBits } from "./bits";
import { bitStyles } from "./bit-styles";
import { formatGenericNumber } from "./number-formatting";
import { radioStyles } from "./radio-styles";

export interface BaseDemoOptions<Types extends readonly string[]> {
    readonly bits: number;
    readonly types: Types;
}

export interface BitElementsOptions {
    offset?: number;
    class?: string;
    locked?: boolean;
}

interface Preset {
    name: string;
    value: number;
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

        // the following properties are used for presets

        @state()
        private presets: Preset[];

        @state()
        private valueAsUInt: number;

    
        static styles: any[] = [
            bitStyles,
            radioStyles
        ]

        constructor() {
            super();

            this.presets = Array.from(this.childNodes)
                .filter((node) => node.nodeType == Node.ELEMENT_NODE)
                .map((elem: HTMLTemplateElement) => ({
                    value: parseInt(elem.dataset.value),
                    name: elem.content.textContent
                }));
        }

        willUpdate(changed: PropertyValues<this>) {
            // update value as uint
            if (changed.has("bits")) {
                this.valueAsUInt = bitsToUInt(this.bits);
            }
        }

        makeBitElements(bits: boolean[], options: BitElementsOptions = {}): TemplateResult | TemplateResult[] {
            const offset = options.offset ?? 0;
            return bits.map((val, idx) => html`
                <div
                    class="bit ${options.class} ${(this.locked || options.locked) ? 'locked' : undefined}"
                    @click=${!options.locked ? () => this.toggleBit(idx + offset) : nothing}
                >${val ? 1 : 0}</div>
            `)
        }

        setPreset(idx: number) {
            console.log("setting preset", idx);
            this.bits = uintToBits(this.presets[idx].value, options.bits);
        }

        makePresets() {
            // these are checkboxes masquerading as radio buttons
            // because they need to be deselected at will
            // (and deselecting radio buttons makes them do weird things)
            return html`
                <div class="radio-box" role="radiogroup" aria-label="Preset">
                    ${this.presets.map((preset, idx) => html`
                        <input
                            type="checkbox"
                            role="radio"
                            name="preset"
                            id="preset-${idx}"
                            value=${preset.name}
                            ?checked=${preset.value == this.valueAsUInt}
                            @change=${() => this.setPreset(idx)}
                        >
                        <label for="preset-${idx}">${preset.name}</label>
                    `)}
                </div>
            `;
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
                <div class="demo">
                    <div class="top">
                        ${this.makePresets()}
                    </div>
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
                this.bits[idx] = !this.bits[idx];
                this.requestUpdate("bits");
            }
        }
    }
    return BaseDemo;
}
