import { describe, expect, it } from "vitest"
import { screen, render } from "@testing-library/react"
import ErrorMessage from "./ErrorMessage"

describe("ErrorMessage", () => {
  describe("renders custom error message", () => {
    it("renders 'This is an error'", () => {
      render(<ErrorMessage message="This is an error" />)
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "This is an error"
      )
    })
    it("renders 'This is an error'", () => {
      render(<ErrorMessage message="A different error message" />)
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "A different error message"
      )
    })
  })
})
