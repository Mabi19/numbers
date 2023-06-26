import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("memory-demo-controller")
export class MemoryDemoController extends LitElement {
    render() {
        return html`
            <button>1/0</button>
            <button>T/F</button>
            <button>A/B</button>
            <button>✅/❌</button>
        `;
    }
}
