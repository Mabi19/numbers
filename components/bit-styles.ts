import { css } from "lit";

export const bitStyles = css`
    math {
        font-family: "Latin Modern Math", "Cambria Math";
        font-size: 1.075em;
    }

    .demo {
        margin: 4px 0;
        padding: 8px;
        border: 1px solid black;
        border-radius: 8px;

        background-color: #fefefe;

        display: flex;
        flex-flow: column nowrap;
        gap: 4px;

        overflow-x: auto;

        width: max-content;
    }

    .bits {
        display: flex;
        flex-flow: row-reverse nowrap;
        align-items: flex-start;
        gap: 3px;
        width: max-content;
    }
    
    .bit.virtual {
        cursor: initial;
        border: none;
        --bit-bg: transparent;
        background-color: var(--bit-bg);
    }

    .bit.locked {
        cursor: not-allowed;
    }

    .bit {
        font-size: 1.125em;
        /* 3rd one is bottom */
        padding: 1px 1px 0 1px;
        user-select: none;
        cursor: pointer;

        --bit-color: black;
        border-bottom: 3px solid var(--bit-color);
    }

    .bit.red {
        --bit-bg: pink;
        --bit-color: tomato;
    }

    .bit.green {
        --bit-bg: lightgreen;
        --bit-color: #22af22;
    }

    .bit.blue {
        --bit-bg: lightblue;
        --bit-color: dodgerblue;
    }

    .bit.gray {
        --bit-bg: #ddd;
        --bit-color: #444;
    }
`;
