import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OperatorState {
  operators: any[];
}

const initialState: OperatorState = {
  operators: [],
};

const operatorSlice = createSlice({
  name: 'operator',
  initialState,
  reducers: {
    setOperators: (state, action: PayloadAction<any[]>) => {
      state.operators = action.payload;
    },
    addOperator: (state, action: PayloadAction<any>) => {
      state.operators.push(action.payload);
    },
    deleteOperator: (state, action: PayloadAction<string>) => {
      state.operators = state.operators.filter(operator => operator.id !== parseInt(action.payload));
    },
  },
});

export const { setOperators, addOperator, deleteOperator } = operatorSlice.actions;
export default operatorSlice.reducer;
