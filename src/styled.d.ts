// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    primary: {
      light: string
      medium: string
      dark: string
    }
    text: string
    board: string
    overlay: {
      light: string
      dark: string
    }
  }
}
