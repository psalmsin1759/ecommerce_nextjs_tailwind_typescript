import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Order = {
  orderid: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  payment_method: string;
  total_price: number;
  tax: number;
  status: string;
  discount: number;
  currency: string;
  shipping_price: number;
  shipping_address: string;
  shipping_postalcode: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  create_account: string;
  password: string;
};

type State = {
  order: Order | null;
};

type Action = { type: 'ADD_ORDER'; payload: Order } | { type: 'DELETE_ORDER' };

const initialState: State = {
  order: null,
};

const OrderContext = createContext<
  | {
      state: State;
      orderDispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ORDER':
      return { order: action.payload };
    case 'DELETE_ORDER':
      return { order: null };
    default:
      return state;
  }
}

type orderProviderProps = {
  children: ReactNode;
};

export function OrderProvider({ children }: orderProviderProps) {
  const [state, orderDispatch] = useReducer(userReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, orderDispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
