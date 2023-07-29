import { css } from "lit";

export const radioStyles = css`
    .radio-box {
        display: flex;
        flex-flow: row nowrap;
    }

    input[type=radio] {
        display: none;
    }

    input[checked] + label {
        background-color: #333;
        color: whitesmoke;
    }

    label {
        padding: 8px;
        border: 1px solid black;
        border-left: none;

        cursor: pointer;
    }

    label:first-of-type {
        border-left: 1px solid black;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    label:last-of-type {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;