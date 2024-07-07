import { useReducer } from "react"
import { Outlet } from "react-router"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from "axios"

import NavBar from "./components/NavBar"
import {
  CreateProfilePage,
  EditProfilePage,
  Login,
  ProfileDetailPage,
  ProfilesPage,
  Register,
} from "./pages/"
import { GlobalContext, globalReducer } from "./utils/reducer.js"
import Toast from "./components/Toast.js"
import ProtectedRoute from "./components/ProtectedRoute.js"
import ForwardToHome from "./components/ForwardToHome.js"

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT // the url of our backend API

//If we intercept requst, it changes the request object before we hit the API
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const initialState = {
  token: localStorage.getItem("token") ?? "",
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : {},
  toast: {
    open: false,
    message: "",
  },
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: "/auth",
        element: <ForwardToHome />,
        children: [
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profiles/create",
            element: <CreateProfilePage />,
          },
          {
            path: "/profiles/:id/edit",
            element: <EditProfilePage />,
          },
          {
            path: "/profiles/:id",
            element: <ProfileDetailPage />,
          },
          // {
          //   path: "/my-ideas",
          //   element: <MyIdeasPage />,
          // },
          {
            path: "/",
            element: <ProfilesPage />,
          },
        ],
      },
    ],
  },
])

function MainPage() {
  return (
    <div className="mb-10">
      <header className="mb-[70px]">
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  const [store, dispatch] = useReducer(globalReducer, initialState)
  return (
    <>
      <GlobalContext.Provider value={{ store, dispatch }}>
        <RouterProvider router={router} />
        <Toast message={store.toast.message} showToast={store.toast.open} />
      </GlobalContext.Provider>
    </>
  )
}

export default App
