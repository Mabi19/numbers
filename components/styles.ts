import { css } from "lit";

export const bitStyles = css`
    .bits {
        display: flex;
        flex-flow: row-reverse nowrap;
        gap: 2px;
        width: max-content;
    }

    .bit {
        user-select: none;
        cursor: pointer;
    }
`;
