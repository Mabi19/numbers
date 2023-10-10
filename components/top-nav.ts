import { LitElement, html, css } from 'lit-element';
import { customElement, property } from "lit/decorators.js";

@customElement('top-nav')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  static styles = css`
    button{
      color: green;
    }
  `;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme');
  }

  render() {
    return html`
      <nav>
        <button @click="${this.toggleTheme}">
          Toggle Theme
        </button>
      </nav>
    `;
  }
}
