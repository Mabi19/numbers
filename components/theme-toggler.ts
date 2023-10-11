import { customElement, property } from "lit/decorators.js";
import { LitElement, css, html } from "lit";

@customElement('theme-toggler')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  static styles = css`
    .switch input {
      position: absolute;
      opacity: 0;
    }

    .switch {
      display: flex;
      justify-content: space-between;
      height: 1em;
      width: 2em;
      padding: 1px;
      background-color: #91a9b1;
      border: 1px solid #91a9b1;
      border-radius: 1em;
      position: relative;
    }
    .ball {
      height: 1em;
      width: 1em;
      border-radius: 1em;
      background: #fff;
      -webkit-transform: translateX(100%);
        -moz-transform: translateX(100%);
              transform: translateX(100%);
      -webkit-transition: all 300ms;
        -moz-transition: all 300ms;
              transition: all 300ms;
      position: absolute;
      top: 1px;
      left: 1px;
    }

    .switch input:checked + .ball {
      -webkit-transform: translateX(0%);
        -moz-transform: translateX(0%);
              transform: translateX(0%);
    }
  `;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    window.document.body.classList.toggle('dark-mode');
  }

  render() {
    return html`
    <label class="switch">
      <input type="checkbox" onchange="changeTheme()"/>
      <div class="ball"></div>
      <img src="assets/moon.svg" />
      <img src="assets/sun.svg" />
    </label>
    `;
  }
}
