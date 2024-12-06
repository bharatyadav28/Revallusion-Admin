import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  pageName: string;
}

const initialState: GeneralState = {
  pageName: "Dashboard",
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    replacePageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { replacePageName } = generalSlice.actions;

export default generalSlice.reducer;
