import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface selectedType {
  selectedPlan: string;
}

const initialState: selectedType = {
  selectedPlan: "",
};

export const selectedPlanSlice = createSlice({
  name: "selectedPlan",
  initialState,
  reducers: {
    setSelectedPlan: (
      state,
      action: PayloadAction<selectedType["selectedPlan"]>
    ) => {
      state.selectedPlan = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedPlan } = selectedPlanSlice.actions;

export default selectedPlanSlice.reducer;
