import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { demoStyles } from "./demo-styles";

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

@customElement("memory-demo")
export class MemoryDemo extends LitElement {
    static readonly WIDTH = 24;
    static readonly HEIGHT = 6;

    @property()
    type: string;

    @state()
    bits: boolean[][];
    
    static readonly EASTER_EGG_TARGET = "gameoflife";
    easterEggProgress = "";
    easterEggTimer: number | null = null;

    static styles = [
        demoStyles,
        css`
            .row {
                display: flex;
                flex-flow: row nowrap;
                gap: 4px;
                font-size: 1.125em;
            }

            .data-bit {
                cursor: pointer;
                user-select: none;
                font-family: "Cascadia Code";
            }
        `
    ];

    constructor() {
        super();

        this.bits = [];
        for (let y = 0; y < MemoryDemo.HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < MemoryDemo.WIDTH; x++) {
                row.push(Math.random() < 0.5);
            }
            this.bits.push(row);
        }

        window.addEventListener("keyup", (ev) => {
            if (ev.key.length > 1) return;

            if (this.easterEggProgress.length >= MemoryDemo.EASTER_EGG_TARGET.length) {
                this.easterEggProgress = this.easterEggProgress.slice(1);
            }
            this.easterEggProgress += ev.key;

            if (this.easterEggProgress == MemoryDemo.EASTER_EGG_TARGET) {
                if (this.easterEggTimer == null) {
                    this.easterEggTimer = setInterval(() => this.runGOLStep(), 300);
                } else {
                    clearInterval(this.easterEggTimer);
                    this.easterEggTimer = null;
                }
            }
        })
    }

    runGOLStep() {
        const neighborOffsets = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],  /*    */ [1, 0],
            [-1, 1],  [0, 1],  [1, 1],
        ];

        const newBits: boolean[][] = [];
        for (let y = 0; y < MemoryDemo.HEIGHT; y++) {
            const row = [];
            for (let x = 0; x < MemoryDemo.WIDTH; x++) {
                let neighborCount = 0;
                for (const [dx, dy] of neighborOffsets) {
                    neighborCount += Number(this.bits
                        [mod(y + dy, MemoryDemo.HEIGHT)]
                        [mod(x + dx, MemoryDemo.WIDTH)]
                    );
                }
                const current = this.bits[y][x];
                if (current) {
                    if (neighborCount < 2 || neighborCount > 3) {
                        row.push(false);
                    } else {
                        row.push(true);
                    }
                } else if (neighborCount == 3) {
                    row.push(true);
                } else {
                    row.push(false);
                }
            }
            newBits.push(row);
        }

        this.bits = newBits;
        this.requestUpdate();
    }

    toggleBit(ev: MouseEvent) {
        console.log("received click");
        const dataset = (ev.target as HTMLElement).dataset;
        const x = parseInt(dataset.x);
        const y = parseInt(dataset.y);

        this.bits[y][x] = !this.bits[y][x];
        this.requestUpdate();
    }

    render() {
        const [one, zero] = this.type.split("_");
        return html`
            <div class="demo">
                ${this.bits.map((row, y) => html`
                    <div class="row">
                        ${repeat(
                            row,
                            (_bit, x) => `${x},${y}`,
                            (bit, x) => html`
                                <div class="data-bit" data-x=${x} data-y=${y} @click=${this.toggleBit}>${bit ? one : zero}</div>
                            `
                        )}
                    </div>
                `)}
            </div>
        `;
    }
}