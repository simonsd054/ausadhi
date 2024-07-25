import { Navbar } from "flowbite-react"
import { Link } from "react-router-dom"

import logoSvg from "../assets/logo.svg"
import { useGlobalContext } from "../utils/reducer"

type NavBarItemsTypes = {
  content: string
  linkTo?: string
  onClick?: () => void
}

export default function NavBar() {
  const { store, dispatch } = useGlobalContext()

  const onClickLogout = () => {
    dispatch({
      type: "setToken",
      data: null,
    })
    dispatch({
      type: "setUser",
      data: {},
    })
  }

  const navbarItemsLoggedIn = [
    {
      content: "Home",
      linkTo: "/",
    },
    {
      content: "Create Profile",
      linkTo: "/profiles/create",
    },
    {
      content: "Logout",
      onClick: onClickLogout,
    },
  ]

  const navbarItemsNotLoggedIn = [
    {
      content: "Register",
      linkTo: "/auth/register",
    },
    { content: "Login", linkTo: "/auth/login" },
  ]
  const navbarItems: NavBarItemsTypes[] = store.token
    ? navbarItemsLoggedIn
    : navbarItemsNotLoggedIn

  return (
    <Navbar fluid rounded className="fixed top-0 w-full z-10">
      <Navbar.Brand as={Link} href="https://flowbite-react.com">
        <img
          src={logoSvg}
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Ausadhi
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {navbarItems.map((item, index) => (
          <Navbar.Link
            as={Link}
            to={item.linkTo}
            data-testid={`item${index}`}
            className="cursor-pointer"
            key={item.content}
            onClick={() => {
              item.onClick && item.onClick()
            }}
          >
            {item.content}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}
