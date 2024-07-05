import { createContext, useContext } from "react"

enum ActionType {
  setToken = "setToken",
  setUser = "setUser",
  showToast = "showToast",
}

interface Action {
  type: ActionType
  data: any
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
