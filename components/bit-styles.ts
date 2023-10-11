import { css } from "lit";

export const bitStyles = css`
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

        --bit-color: var(--bit-bottom);
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
        --bit-bg: var(--primary);
        --bit-color: #444;
    }
`;
