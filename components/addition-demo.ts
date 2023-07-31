import { LitElement, TemplateResult, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { demoStyles } from "./demo-styles";
import { bitsToInt, uintToBits } from "./bits";
import { formatGenericNumber } from "./number-formatting";

const MISSING = Symbol("Missing bit");

@customElement("addition-demo")
export class AdditionDemo extends LitElement {
    @property({ converter: (str) => uintToBits(parseInt(str), 8), type: Array, attribute: "value1" })
    bits1: boolean[] = uintToBits(0, 8);

    @property({ converter: (str) => uintToBits(parseInt(str), 8), type: Array, attribute: "value2" })
    bits2: boolean[] = uintToBits(0, 8);

    @state()
    overflow = new Array<boolean>(9).fill(false);

    @state()
    result = new Array<boolean | typeof MISSING>(8).fill(MISSING);

    @state()
    animationProgress: number = -1;

    @state()
    isAutoplaying: boolean = false;

    static styles = [
        demoStyles,
        css`
            @keyframes overflow-bit {
                0% {
                    transform: translate(calc(var(--bit-width) + 4px), calc(var(--center) - var(--overflow)));
                }

                100% {
                    transform: translate(0, 0);
                }
            }

            @keyframes result-bit {
                0% {
                    transform: translateY(calc(var(--center) - var(--result) - 4px));
                }

                100% {
                    transform: translateY(0);
                }
            }

            @keyframes overflow-drop {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                
                100% {
                    transform: translateY(200%);
                    opacity: 0;
                }
            }

            .calculation {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-template-areas:
                    "bo ."
                    "bt dt"
                    "bb db"
                    "line line"
                    "br dr";
                column-gap: 8px;
            }

            .row {
                display: flex;
                flex-flow: row-reverse nowrap;
                gap: 4px;
                font-size: 1.125em;
            }

            .bit {
                cursor: pointer;
                user-select: none;
                transition: transform .5s ease-in-out;
            }

            .playing .bit {
                cursor: not-allowed;
            }

            .overflow {
                font-size: 0.9em !important;
                grid-area: bo;
            }

            .top {
                grid-area: bt;
            }

            .bottom {
                grid-area: bb;
            }

            .d-top {
                grid-area: dt;
            }

            .d-bottom {
                grid-area: db;
            }

            .d-result {
                grid-area: dr;
            }

            .overflow .bit {
                width: var(--bit-width);
                text-align: center;
            }

            .overflow .bit:not(.hidden) {
                animation: .75s ease-in-out overflow-bit;
            }

            .overflow .animate {
                transform: translateY(calc(var(--center) - var(--overflow)));
            }

            .top .animate {
                transform: translateY(calc(var(--center) - var(--top)));
            }

            .bottom .animate {
                transform: translateY(calc(var(--center) - var(--bottom)));
            }

            .result .bit:not(.hidden) {
                animation: .75s ease-in-out result-bit;
            }

            .finishing .overflow .bit:not(.hidden):last-child {
                animation: .5s ease-in forwards overflow-drop;
            }

            .reappear .bit {
                transition: opacity .2s ease-in-out;
            }
            
            .hidden {
                /* this is transitioned */
                opacity: 0;
                /* without !important would get overridden by not-allowed when playing */
                cursor: initial !important;
            }

            .plus {
                margin-right: 4px;
            }

            .line {
                border-bottom: 2px solid black;
                grid-area: line;
            }

            .result {
                height: 1em;
                grid-area: br;
            }

            .controls {
                display: flex;
                flex-flow: row nowrap;
                gap: 6px;
            }

            button {
                background-color: inherit;
                font: inherit;
                color: #333;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 4px;

                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                gap: 4px;

                cursor: pointer;
            }

            button:hover {
                background-color: #f5f5f5;
            }

            button img {
                height: 1em;
            }
        `
    ];

    firstUpdated() {
        function middle(row: Element) {
            const bitElem = row.firstElementChild;
            const bbox = bitElem.getBoundingClientRect();
            return bbox.y + bbox.height / 2;
        }

        // prepare style vars
        const rows = Array.from(this.renderRoot.querySelectorAll(".row"));
        const [overflow, top, bottom, result] = rows;
        const styleVars = {
            "bit-width": top.firstElementChild.getBoundingClientRect().width,
            "overflow": middle(overflow),
            "top": middle(top),
            "center": -1,
            "bottom": middle(bottom),
            "result": middle(result),
        };
        styleVars.center = (styleVars.top + styleVars.bottom) / 2;

        // apply them
        const demo = this.renderRoot.querySelector<HTMLDivElement>(".demo");
        Object.entries(styleVars).map(([name, value]) => {
            demo.style.setProperty(`--${name}`, `${value}px`);
        });
    }

    private startAnimation() {
        // initialize parameters
        this.animationProgress = -0.5;
        this.overflow.fill(false);
        this.result.fill(MISSING);

        this.animationStep();
    }

    private animationStep() {
        if (this.animationProgress == -1 || this.animationProgress == 8.5) return;

        this.animationProgress += 0.5;

        if (this.animationProgress == 8) {
            this.animationProgress = 8.5;
            this.finishAnimation();
            return;
        }

        let delay: number;
        
        const truncatedProgress = Math.trunc(this.animationProgress)
        if (this.animationProgress == truncatedProgress) {
            // move together
            delay = 550;
        } else {
            // generate new bits
            const sum = Number(this.bits1[truncatedProgress]) +
                Number(this.bits2[truncatedProgress]) +
                Number(this.overflow[truncatedProgress]);
            const resultBit = Boolean(sum & 1);
            const overflowBit = Boolean(sum & 2);
            
            this.result[truncatedProgress] = resultBit;
            this.overflow[truncatedProgress + 1] = overflowBit;

            this.requestUpdate();

            delay = 800;
        }
        
        if (this.isAutoplaying && this.animationProgress <= 7.5) {
            setTimeout(() => this.animationStep(), delay);
        }
    }

    private finishAnimation() {
        // wait for last bit to drop if necessary
        const delay = this.overflow.at(-1) ? 1000 : 500;

        setTimeout(() => {
            // reappear all the bits
            this.animationProgress = -1;
            this.overflow.fill(false);
            this.isAutoplaying = false;
        }, delay);
    }

    handleAutoplay() {
        // enable autoplay and start
        this.isAutoplaying = true;
        this.startAnimation();
    }

    handleStep() {
        // run 1 step
        if (this.animationProgress == -1) {
            this.isAutoplaying = false;
            this.startAnimation();
        } else {
            this.animationStep();
        }
    }

    handleStop() {
        // reset everything
        this.animationProgress = -1;
        this.overflow.fill(false);
        this.result.fill(MISSING);

        this.isAutoplaying = false;
    }

    private makeBitElements(bits: boolean[], which: 1 | 2) {
        return repeat(bits, (_bit, idx) => idx, (bit, idx) => {
            let animClass = "";
            
            if (this.animationProgress == idx) {
                animClass = "animate";
            } else if (this.animationProgress > idx) {
                animClass = "hidden";
            }

            return html`
                <div class="bit ${animClass}" @click=${() => this.toggleBit(which, idx)}>${bit ? 1 : 0}</div>
            `
        })
    }

    private makeOverflow() {
        return repeat(this.overflow, (_bit, idx) => idx, (bit, idx) => {
            let extraClass: string; 
            if (!bit) {
                extraClass = "hidden";
            } else if (this.animationProgress == idx) {
                extraClass = "animate";
            } else if (this.animationProgress > idx) {
                // hide when animation's over
                extraClass = "hidden";
            }

            return html`
                <div class="bit ${extraClass}">1</div>
            `
        });
    }

    private makeResult() {
        return repeat(this.result, (_bit, idx) => idx, (bit) => html`
            <div class="bit ${bit == MISSING ? "hidden" : ""}">${bit ? 1 : 0}</div>
        `);
    }

    render() {
        let animClass = "";
        if (this.animationProgress == 8) {
            animClass = "finishing";
        } else if (this.animationProgress == -1) {
            animClass = "reappear";
        }

        if (this.animationProgress > -1) {
            animClass += " playing";
        }

        let decimalResult: TemplateResult | typeof nothing;
        if (this.result.every((val) => val != MISSING)) {
            decimalResult = html`(= ${formatGenericNumber(bitsToInt(this.result as boolean[]))})`
        } else {
            decimalResult = nothing;
        }

        const startButton = html`
            <button @click=${this.handleAutoplay}>
                <img src="./assets/play.svg" role="presentation"><span>Start</span>
            </button>
        `;
        const stepButton = html`
            <button @click=${this.handleStep}>
                <img src="./assets/step.svg" role="presentation"><span>Step</span>
            </button>
        `;
        const stopButton = html`
            <button @click=${this.handleStop}>
                <img src="./assets/stop.svg" role="presentation"><span>Stop</span>
            </button>
        `;

        return html`
            <div class="demo ${animClass}">
                <div class="calculation">
                    <div class="row overflow">
                        ${this.makeOverflow()}
                    </div>
                    <div class="row top">
                        ${this.makeBitElements(this.bits1, 1)}
                    </div>
                    <div class="decimal d-top">
                        (= ${formatGenericNumber(bitsToInt(this.bits1))})
                    </div>
                    <div class="row bottom">
                        ${this.makeBitElements(this.bits2, 2)}
                        <div class="plus">+</div>
                    </div>
                    <div class="decimal d-bottom">
                        (= ${formatGenericNumber(bitsToInt(this.bits2))})
                    </div>
                    <div class="line"></div>
                    <div class="row result">
                        ${this.makeResult()}
                    </div>
                    <div class="decimal d-result">
                        ${decimalResult}
                    </div>
                </div>
                <div class="controls">
                    ${when(this.animationProgress == -1, () => html`
                        ${startButton}
                        ${stepButton}
                    `, () => html`
                        ${stopButton}
                        ${!this.isAutoplaying ? stepButton : nothing}
                    `)}
                </div>
            </div>
        `;
    }

    private toggleBit(which: 1 | 2, idx: number) {
        if (this.animationProgress != -1) {
            return;
        }

        if (which == 1) {
            this.bits1[idx] = !this.bits1[idx];
        } else {
            this.bits2[idx] = !this.bits2[idx];
        }
        this.requestUpdate();
    }
}
