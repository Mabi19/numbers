import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { radioStyles } from "./radio-styles";

@customElement("type-switcher")
export class TypeSwitcher extends LitElement {
    @property()
    target: string;

    @property({ type: Array })
    types: { id: string, name: string }[];

    @property()
    selected?: string;

    @state()
    private targetElement: HTMLElement;

    static styles = [
        radioStyles
    ];

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.targetElement = document.querySelector(this.target);
        this.select(this.selected ?? this.types[0].id);
    }

    select(type: string) {
        console.log("switching to", type);
        this.selected = type;
        this.targetElement.setAttribute("type", this.selected);
    }

    render() {
        return html`
            <div class="radio-box">
                ${this.types.map((type) => html`
                    <input
                        type="radio"
                        name="type-switcher"
                        id="ts-${type.id}"
                        value=${type.id}
                        ?checked=${type.id == this.selected}
                        @change=${() => this.select(type.id)}
                    >
                    <label for="ts-${type.id}">${type.name}</label>
                `)}
            </div>
        `;
    }
}