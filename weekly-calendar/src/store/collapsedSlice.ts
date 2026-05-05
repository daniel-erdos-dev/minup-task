import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface CollapsedState {
  collapsedBlocksStartHours: number[];
}

const initialState: CollapsedState = {
  collapsedBlocksStartHours: [],
};

export const collapsedSlice = createSlice({
  name: "collapsed",
  initialState,
  reducers: {
    toggleBlock(state, action: PayloadAction<number>) {
      const hour = action.payload;
      const index = state.collapsedBlocksStartHours.indexOf(hour);
      if (index === -1) {
        state.collapsedBlocksStartHours.push(hour);
      } else {
        state.collapsedBlocksStartHours.splice(index, 1);
      }
    },
    collapseAllBlocks(state, action: PayloadAction<number[]>) {
      state.collapsedBlocksStartHours = action.payload;
    },
    expandAllBlocks(state) {
      state.collapsedBlocksStartHours = [];
    },
  },
});

export const {toggleBlock, collapseAllBlocks, expandAllBlocks} =
  collapsedSlice.actions;

export const selectCollapsedBlocks = (state: {collapsed: CollapsedState}) =>
  state.collapsed.collapsedBlocksStartHours;

export const selectIsAllCollapsed = (allBlockStartHours: number[]) =>
  createSelector(
    selectCollapsedBlocks,
    (collapsed) =>
      allBlockStartHours.length > 0 &&
      allBlockStartHours.every((h) => collapsed.includes(h)),
  );

export default collapsedSlice.reducer;
