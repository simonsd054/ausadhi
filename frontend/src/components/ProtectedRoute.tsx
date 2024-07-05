import { Navigate, Outlet } from "react-router-dom"

import { useGlobalContext } from "../utils/reducer"

export default function ProtectedRoute() {
  const { store } = useGlobalContext()

  if (store.token && store.user.id) {
    return <Outlet />
  } else {
    return <Navigate to="/auth/login" replace />
  }
}
