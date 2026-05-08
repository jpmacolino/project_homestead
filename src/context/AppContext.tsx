import { createContext, useContext, useReducer, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Track = "sprout" | "seedling" | "sapling" | "branch" | "canopy";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
}

export interface AppState {
  currentChild: ChildProfile | null;
  currentTrack: Track;
  audioEnabled: boolean;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type AppAction =
  | { type: "SET_CHILD"; payload: ChildProfile | null }
  | { type: "SET_TRACK"; payload: Track }
  | { type: "SET_AUDIO_ENABLED"; payload: boolean };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const initialState: AppState = {
  currentChild: null,
  currentTrack: "sprout",
  audioEnabled: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CHILD":
      return { ...state, currentChild: action.payload };
    case "SET_TRACK":
      return { ...state, currentTrack: action.payload };
    case "SET_AUDIO_ENABLED":
      return { ...state, audioEnabled: action.payload };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
