import { render, screen } from "@testing-library/react"
import FormInput from "./FormInput"

const formInputProps = {
  id: "test",
  label: "test",
  register: vi.fn(),
  registerName: "test",
}

describe("FormInput", () => {
  it("renders FormInput", () => {
    render(
      <FormInput
        {...formInputProps}
        errors={{
          test: undefined,
        }}
      />
    )

    expect(screen.getByLabelText("test")).toBeInTheDocument()
    expect(screen.getByTestId("form-input")).toBeInTheDocument()
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument()
  })

  it("renders ErrorMessage for normal errors", () => {
    render(
      <FormInput
        {...formInputProps}
        errors={{
          test: { type: "value", message: "This is an error" },
        }}
      />
    )

    expect(screen.getByTestId("error-message")).toBeInTheDocument()
  })

  it("renders error for array errors", () => {
    render(
      <FormInput
        {...formInputProps}
        arrayFieldInfo={{
          arrayName: "testArray",
          index: 0,
          registerName: "test",
        }}
        errors={{
          testArray: {
            0: {
              test: { type: "value", message: "This is an error" },
            },
          },
        }}
      />
    )
    expect(screen.getByTestId("error-message")).toBeInTheDocument()
  })

  it("renders error for array errors being array ownself", () => {
    render(
      <FormInput
        {...formInputProps}
        arrayFieldInfo={{
          arrayName: "testArray",
          index: 0,
          registerName: "test",
        }}
        isArray
        arrayName="testArrayName"
        insideIndex={0}
        errors={{
          testArray: {
            0: {
              testArrayName: {
                0: {
                  test: { type: "value", message: "This is an error" },
                },
              },
            },
          },
        }}
      />
    )
    expect(screen.getByTestId("error-message")).toBeInTheDocument()
  })
})
