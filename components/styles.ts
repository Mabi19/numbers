import { css } from "lit";

export const bitStyles = css`
    .bits {
        display: flex;
        flex-flow: row-reverse nowrap;
        gap: 2px;
        width: max-content;
    }

    .bits.locked {
        background-color: lightgray;
    }

    .bits.locked .bit {
        cursor: initial;
    }

    .bit {
        user-select: none;
        cursor: pointer;
    }

    .bit.red {
        background-color: pink;
    }

    .bit.green {
        background-color: lightgreen;
    }

    .bit.blue {
        background-color: lightblue;
    }
`;
