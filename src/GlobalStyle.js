import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        scroll-behavior: smooth;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
    }

    body {
        color: ${({ theme }) => theme.colors.text};
        font-family: ${({ theme }) => theme.fonts.body};
        font-weight: 400;
    }

    a {
        color: inherit; 
        text-decoration: none; 

        &:hover {
            color: inherit;
            text-decoration: none;
        }
        
        &:visited {
            color: inherit;
        }
        
        &:active {
            color: inherit;
        }
    }

    input {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        border: none;
        border-radius: 0;
        background: transparent;
        padding: 0;
        margin: 0;
        outline: none;
        font-family: inherit;
        font-size: inherit;
        color: inherit;

        &::-webkit-input-placeholder {
            color: inherit;
            opacity: 0.7;
        }
    }
`