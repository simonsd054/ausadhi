export default function ErrorMessage({ message }: { message?: string }) {
  return (
    <span data-testid="error-message" className="text-red-700 text-sm">
      {message}
    </span>
  )
}
