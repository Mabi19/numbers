import { customElement, property } from "lit/decorators.js";
import { LitElement, css, html } from "lit";

@customElement('theme-toggler')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  static styles = css`
  .th-switch {
    height: 22px;
    width: 40px;
    display: block;
    border-radius: 11px;
    border: 1px solid rgba(60, 60, 60, 0.29);
    background-color: #f1f1f1;
    position: relative;
  }
  .ball {
    background-color: #fff;
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
    transition: background-color .25s,transform .25s;
  }
  .ball img {
    position: absolute;
    top: 3px;
    left: 3px;
    height: 12px;
    widtth: 12px;
  }
  `;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    window.document.body.classList.toggle('dark-mode');
  }

  render() {
    return html`
    <button class="th-switch" @click=${this.toggleTheme}>
      <span class="ball">
        <img src="assets/${this.isDarkTheme? "sun" : "moon"}.svg" />
      </span>
    </button>
    `;
  }
}
