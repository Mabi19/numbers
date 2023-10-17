// import { customElement, property } from "lit/decorators.js";
// import { LitElement, css, html } from "lit";

// @customElement('theme-toggler')
// export class SimpleNav extends LitElement {
//   @property({ type: Boolean }) isDarkTheme = false;

// static styles = css`
// .tgl-switch {
//   height: 22px;
//   width: 40px;
//   display: block;
//   border-radius: 11px;
//   border: 1px solid rgba(60, 60, 60, 0.29);
//   position: relative;
//   background-color: #f1f1f1;
//   cursor: pointer;
// }
// .tgl-switch:hover {
//   border-color: #8e8e8e;
// }
// .tgl-dark {
//   background-color: #2f2f2f !important;
//   border: 1px solid rgba(84, 84, 84, .65) !important;
// }
// .tgl-dark:hover {
//   border-color: rgba(195, 195, 195, 0.65);
// }
// .ball {
//   background-color: #fff;
//   position: absolute;
//   top: 1px;
//   left: 1px;
//   width: 18px;
//   height: 18px;
//   border-radius: 50%;
//   box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
//   transition: transform .25s;
// }
// .ball img {
//   position: absolute;
//   top: 3px;
//   left: 3px;
//   height: 12px;
//   widtth: 12px;
// }
// .active-ball {
//   transform: translateX(100%);
//   background-color: #000 !important;
// }
// `;

// toggleTheme() {
//   this.isDarkTheme = !this.isDarkTheme;
//   window.document.body.classList.toggle('dark-mode');
// }

//   render() {
//     return html`
//     <button class="tgl-switch ${this.isDarkTheme?"tgl-dark":""}" @click=${this.toggleTheme}>
//       <span class="ball ${this.isDarkTheme?"active-ball":""}">
//         <img src="assets/${this.isDarkTheme? "moon" : "sun"}.svg" />
//       </span>
//     </button>
//     `;
//   }
// }

import { customElement, property } from "lit/decorators.js";
import { LitElement, css, html } from "lit";

@customElement('theme-toggler')
export class SimpleNav extends LitElement {
  @property({ type: Boolean }) isDarkTheme = false;

  connectedCallback() {
    super.connectedCallback();
    // Check the user's preferred color scheme and set the theme accordingly
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkTheme = userPrefersDark;

    // Retrieve theme preference from local storage, if available
    const storedTheme = localStorage.getItem('isDarkTheme');
    if (storedTheme !== null) {
      this.isDarkTheme = storedTheme === 'true';
      this.toggleThemeClass();
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.toggleThemeClass();
    // Store the selected theme in local storage
    localStorage.setItem('isDarkTheme', this.isDarkTheme.toString());
  }

  toggleThemeClass() {
    if (this.isDarkTheme) {
      window.document.body.classList.add('dark-mode');
    } else {
      window.document.body.classList.remove('dark-mode');
    }
  }

  static styles = css`
  .tgl-switch {
    height: 22px;
    width: 40px;
    display: block;
    border-radius: 11px;
    border: 1px solid rgba(60, 60, 60, 0.29);
    position: relative;
    background-color: #f1f1f1;
    cursor: pointer;
  }
  .tgl-switch:hover {
    border-color: #8e8e8e;
  }
  .tgl-dark {
    background-color: #2f2f2f !important;
    border: 1px solid rgba(84, 84, 84, .65) !important;
  }
  .tgl-dark:hover {
    border-color: rgba(195, 195, 195, 0.65);
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
    transition: transform .25s;
  }
  .ball img {
    position: absolute;
    top: 3px;
    left: 3px;
    height: 12px;
    widtth: 12px;
  }
  .active-ball {
    transform: translateX(100%);
    background-color: #000 !important;
  }
  `;

  render() {
    return html`
      <button class="tgl-switch ${this.isDarkTheme ? 'tgl-dark' : ''}" @click=${this.toggleTheme}>
        <span class="ball ${this.isDarkTheme ? 'active-ball' : ''}">
          <img src="assets/${this.isDarkTheme ? 'moon' : 'sun'}.svg" />
        </span>
      </button>
    `;
  }
}

