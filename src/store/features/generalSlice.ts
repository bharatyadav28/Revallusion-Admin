import { userType } from "@/lib/interfaces-types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  pageName: string;
  user: userType;
}

export const userInitalState: userType = {
  _id: null,
  avatar: null,
  email: null,
  name: null,
  mobile: null,
  isEmailVerified: false,
  isMobileVerified: false,
};

const initialState: GeneralState = {
  pageName: "Dashboard",
  user: userInitalState,
};

export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    replacePageName: (state, action: PayloadAction<string>) => {
      state.pageName = action.payload;
    },

    setUser: (state, action: PayloadAction<GeneralState["user"]>) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { replacePageName, setUser } = generalSlice.actions;

export default generalSlice.reducer;
