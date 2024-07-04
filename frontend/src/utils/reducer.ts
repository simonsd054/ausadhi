import { createContext, useContext } from "react"

enum ActionType {
  INCREASE = "setToken",
  DECREASE = "setUser",
}

interface Action {
  type: ActionType
  data: string
}

interface State {
  token: string
  user: any
}

interface GlobalState {
  store: any
  dispatch: any
}

const GlobalContext = createContext<GlobalState>({
  store: null,
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
    default:
      return state
  }
}

export { GlobalContext, useGlobalContext, globalReducer }
