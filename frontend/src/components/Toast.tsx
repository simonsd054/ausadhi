import { Toast as ReactToast } from "flowbite-react"

export default function Toast({
  showToast = false,
  onDismiss,
  message,
}: {
  showToast?: boolean
  onDismiss?: () => void
  message: string
}) {
  return (
    showToast && (
      <ReactToast className="fixed top-5 right-5 bg-slate-800 text-white z-[100]">
        <div className="ml-3 text-sm font-normal">{message}</div>
        <ReactToast.Toggle
          className="bg-slate-800 text-white"
          onDismiss={onDismiss}
        />
      </ReactToast>
    )
  )
}
