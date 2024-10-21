import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  schedule: {
    [key: string]: string;
  };
  workingWithTier3: boolean;
}

interface EmployeeState {
  employees: Employee[];
}

type EmployeeAction =
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'ASSIGN_TASK'; payload: { employeeId: string; timeSlot: string; task: string } }
  | { type: 'DELETE_TASK'; payload: { employeeId: string; timeSlot: string } }
  | { type: 'TOGGLE_TIER3'; payload: string };

const employeeReducer = (state: EmployeeState, action: EmployeeAction): EmployeeState => {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
      };
    case 'ASSIGN_TASK':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.employeeId
            ? {
                ...emp,
                schedule: {
                  ...emp.schedule,
                  [action.payload.timeSlot]: action.payload.task,
                },
              }
            : emp
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.employeeId
            ? {
                ...emp,
                schedule: Object.fromEntries(
                  Object.entries(emp.schedule).filter(
                    ([timeSlot]) => timeSlot !== action.payload.timeSlot
                  )
                ),
              }
            : emp
        ),
      };
    case 'TOGGLE_TIER3':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload
            ? { ...emp, workingWithTier3: !emp.workingWithTier3 }
            : emp
        ),
      };
    default:
      return state;
  }
};

const EmployeeContext = createContext<{
  state: EmployeeState;
  dispatch: React.Dispatch<EmployeeAction>;
} | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, { employees: [] });

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      dispatch({ type: 'SET_EMPLOYEES', payload: JSON.parse(storedEmployees) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(state.employees));
  }, [state.employees]);

  return (
    <EmployeeContext.Provider value={{ state, dispatch }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};