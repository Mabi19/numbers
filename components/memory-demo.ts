import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("memory-demo")
export class MemoryDemo extends LitElement {
    render() {
        return html`
            <p>memory demo</p>
        `;
    }
}