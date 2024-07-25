import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import Toast from "./Toast"

describe("Toast", () => {
  describe("renders custom toast message when showToast is true", () => {
    it("renders 'This is a toast'", () => {
      render(<Toast message="This is a toast" showToast={true} />)
      expect(screen.getByTestId("toast-message")).toHaveTextContent(
        "This is a toast"
      )
    })
    it("renders 'Another Toast Message'", () => {
      render(<Toast message="Another Toast Message" showToast={true} />)
      expect(screen.getByTestId("toast-message")).toHaveTextContent(
        "Another Toast Message"
      )
    })
  })

  describe("does not render toast message when showToast is false or not provided", () => {
    it("renders 'Another Toast Message'", () => {
      render(<Toast message="Another Toast Message" showToast={false} />)
      expect(screen.queryByTestId("toast-message")).not.toBeInTheDocument()
    })
    it("renders 'Another Toast Message'", () => {
      render(<Toast message="Another Toast Message" />)
      expect(screen.queryByTestId("toast-message")).not.toBeInTheDocument()
    })
  })

  describe("onDismiss function is called when the cross button is clicked", () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    it("calls onDismiss function exactly once", async () => {
      render(
        <Toast
          message="Another Toast Message"
          showToast={true}
          onDismiss={onDismiss}
        />
      )
      const crossButton = screen.getByTestId("cross-button")
      await user.click(crossButton)
      expect(onDismiss).toHaveBeenCalledOnce()
    })
  })
})
