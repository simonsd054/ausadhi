import { Toast as ReactToast } from "flowbite-react"

export default function Toast({
  showToast = true,
  onDismiss,
  message,
}: {
  showToast?: boolean
  onDismiss?: () => void
  message: string
}) {
  if (!open) {
    return
  }
  return (
    showToast && (
      <ReactToast className="fixed bottom-5 right-5">
        <div className="ml-3 text-sm font-normal">{message}</div>
        <ReactToast.Toggle onDismiss={onDismiss} />
      </ReactToast>
    )
  )
}
