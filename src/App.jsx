import styled, { ThemeProvider } from "styled-components"
import { theme } from "./theme"
import { GlobalStyle } from "./GlobalStyle"
import { Outlet } from "react-router-dom"

const Container = styled.div`
  max-width: 568px;
  width: 100%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App

/*

- Logout function
- Add filtering options
- Desktop layout

*/
