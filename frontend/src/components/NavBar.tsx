import { Navbar } from "flowbite-react"
import { Link } from "react-router-dom"

import logoSvg from "../assets/logo.svg"

const navbarItemsLoggedIn = [
  {
    content: "Home",
    linkTo: "/",
  },
  {
    content: "Post Idea",
    linkTo: "/ideas/create",
  },
]

const navbarItemsNotLoggedIn = [
  {
    content: "Register",
    linkTo: "/auth/register",
  },
  { content: "Login", linkTo: "/auth/login" },
]

export default function NavBar() {
  return (
    <Navbar fluid rounded>
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
        {navbarItemsNotLoggedIn.map((item) => (
          <Navbar.Link key={item.content} href={item.linkTo}>
            {item.content}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  )
}
