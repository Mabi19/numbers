import { customElement, property } from "lit/decorators.js";
import { LitElement, css, html } from "lit";

@customElement('theme-toggler')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  static styles = css`
    button:hover {
        background-color: lightblue;
    }
  `;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    window.document.body.classList.toggle('dark-mode');
  }

  render() {
    return html`
      <button @click="${this.toggleTheme}">
        ${this.isDarkTheme
          ? "Light"
          : "Dark"}
        Mode
      </button>
    `;
  }
}
