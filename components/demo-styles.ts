import { css } from "lit";

export const demoStyles = css`
    *, *::after, *::before {
        box-sizing: border-box;
    }

    math {
        font-family: "Latin Modern Math", "Cambria Math";
        font-size: 1.075em;
    }

    .demo {
        margin: 4px 0;
        padding: 8px;
        border: 1px solid black;
        border-radius: 8px;

        background-color: var(--secondary);

        display: flex;
        flex-flow: column nowrap;
        gap: 4px;

        overflow-x: auto;

        width: max-content;
        max-width: 100%;
    }
`