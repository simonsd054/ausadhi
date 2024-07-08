import { createContext, useContext } from "react"

type Action =
  | { type: "setToken"; data: string }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  | {
      type: "setUser"
      data: {
        id: string
        name: string
        email: string
      }
    }
  | {
      type: "showToast"
      data: {
        open: boolean
        message: string
      }
    }

interface State {
  token: string
  user: {
    id: string
    email: string
    name: string
  }
  toast: {
    open: boolean
    message: string
  }
}

interface GlobalState {
  store: State
  /* eslint-disable @typescript-eslint/no-explicit-any */
  dispatch: any
}

const GlobalContext = createContext<GlobalState>({
  store: {
    token: "",
    user: {
      id: "",
      email: "",
      name: "",
    },
    toast: {
      open: false,
      message: "",
    },
  },
  dispatch: null,
})
const useGlobalContext = () => useContext(GlobalContext)

function globalReducer(state: State, action: Action) {
  switch (action.type) {
    case "setToken": {
      localStorage.setItem("token", action.data || "")
      return {
        ...state,
        token: action.data,
      }
    }
    case "setUser": {
      localStorage.setItem("user", JSON.stringify(action.data) || "")
      return {
        ...state,
        user: action.data,
      }
    }
    case "showToast": {
      return {
        ...state,
        toast: {
          open: action.data.open,
          message: action.data.message,
        },
      }
    }
    default:
      return state
  }
}

export { GlobalContext, useGlobalContext, globalReducer }
