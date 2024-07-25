import { screen, render } from "@testing-library/react"
import NavBar from "./NavBar"
import { GlobalContext } from "../utils/reducer"
import { BrowserRouter } from "react-router-dom"

const Wrapper = ({
  children,
  tokenValue = "",
}: {
  children: React.ReactNode
  tokenValue?: string
}) => {
  return (
    <BrowserRouter>
      <GlobalContext.Provider
        value={{
          store: {
            toast: {
              open: false,
              message: "",
            },
            token: tokenValue,
            user: {
              id: "",
              email: "",
              name: "",
            },
          },
          dispatch: () => {},
        }}
      >
        {children}
      </GlobalContext.Provider>
    </BrowserRouter>
  )
}

describe("NavBar", () => {
  it("renders register and login by default; and has correct href values", () => {
    render(
      <Wrapper>
        <NavBar />
      </Wrapper>
    )
    const registerLink = screen.getByRole("link", { name: "Register" })
    expect(registerLink).toBeInTheDocument()
    expect(registerLink).toHaveAttribute("href", "/auth/register")

    const loginLink = screen.getByRole("link", { name: "Login" })
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute("href", "/auth/login")
  })

  it("renders Home, Create Profile and Logout when token present; and has correct href values", () => {
    render(
      <Wrapper tokenValue="some-value">
        <NavBar />
      </Wrapper>
    )

    const homeLink = screen.getByRole("link", { name: "Home" })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute("href", "/")

    const createProfileLink = screen.getByRole("link", {
      name: "Create Profile",
    })
    expect(createProfileLink).toBeInTheDocument()
    expect(createProfileLink).toHaveAttribute("href", "/profiles/create")

    const logoutLink = screen.getByRole("link", { name: "Logout" })
    expect(logoutLink).toBeInTheDocument()
  })
})
