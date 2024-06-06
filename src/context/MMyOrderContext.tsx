import { createContext, useContext, useReducer, ReactNode } from 'react';

interface OrderState {
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
}

interface DataAction {
  type: string;
  payload: Partial<OrderState>;
}

// Add an action type for deleting an order
type DeleteOrderAction = {
  type: 'DELETE_ORDER';
  order: OrderState;
};

const DataStateContext = createContext<OrderState | undefined>(undefined);
const DataDispatchContext = createContext<
  React.Dispatch<DataAction> | undefined
>(undefined);

function dataReducer(
  state: OrderState,
  action: DataAction | DeleteOrderAction
): OrderState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload };
    /* case 'DELETE_ORDER':
      return {
        order: null,
      }; */
    default:
      return state;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, {
    orderid: 0,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    payment_method: '',
    total_price: 0,
    tax: 0,
    status: '',
    discount: 0,
    currency: '',
    shipping_price: 0,
    shipping_address: '',
    shipping_postalcode: '',
    shipping_city: '',
    shipping_state: '',
    shipping_country: '',
    create_account: '',
    password: '',
  });

  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

export function useDataState(): OrderState {
  const context = useContext(DataStateContext);
  if (context === undefined) {
    throw new Error('useDataState must be used within a DataProvider');
  }
  return context;
}

export function useDataDispatch(): React.Dispatch<DataAction> {
  const context = useContext(DataDispatchContext);
  if (context === undefined) {
    throw new Error('useDataDispatch must be used within a DataProvider');
  }
  return context;
}
