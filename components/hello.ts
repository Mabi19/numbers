import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("hello-lit")
export class HelloLit extends LitElement {
    render() {
        return html`
            <p>Hello from Lit!!</p>
        `;
    }
}