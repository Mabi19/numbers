import { LitElement, html, css, property } from 'lit-element';

@customElement('top-nav')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    nav {
      background-color: #333;
      padding: 10px;
    }
    button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    svg {
      width: 24px;
      height: 24px;
      margin-right: 5px;
    }
  `;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  render() {
    return html`
      <nav>
        <button @click="${this.toggleTheme}">
          ${this.isDarkTheme
            ? html`Light`
            : html`Dark`}
          Toggle Theme
        </button>
      </nav>
    `;
  }
}
