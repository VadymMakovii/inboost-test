import { createSlice } from '@reduxjs/toolkit';

const nodesSlice = createSlice({
  name: 'global',
  initialState: {
    nodes: [],
    edges: [],
    },
  reducers: {
    addNodes(state, action) {
      state.nodes = action.payload;
    },
    addEdges(state, action) {
      state.edges = action.payload;
    }
  },
});
export const { addNodes, addEdges } = nodesSlice.actions;
export const nodesReducer = nodesSlice.reducer;