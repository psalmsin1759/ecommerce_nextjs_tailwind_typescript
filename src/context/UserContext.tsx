import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the user state and actions
export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Add more user properties as needed
};

type State = {
  user: User | null;
};

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE'; payload: Partial<User> }; // Add an "UPDATE" action

const initialState: State = {
  user: null,
};

const UserContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    case 'UPDATE':
      if (state.user) {
        // Update only specific fields (e.g., firstName and lastName)
        return {
          user: {
            ...state.user,
            firstName: action.payload.firstName || state.user.firstName,
            lastName: action.payload.lastName || state.user.lastName,
          },
        };
      }
      return state;
    default:
      return state;
  }
}

// Create a UserProvider component
type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// Create a custom hook to access user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function updateUser(
  dispatch: React.Dispatch<Action>,
  updatedFields: Partial<User>
) {
  dispatch({ type: 'UPDATE', payload: updatedFields });
}
