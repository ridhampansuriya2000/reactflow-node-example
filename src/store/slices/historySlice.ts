import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {resetState} from "../actions";

interface HistoryItem {
    id: string; // Adjust type as per your needs
    data: string; // Replace with actual data type
}

interface HistoryData {
    past: any[];
    present: any
    future: any[];
}

interface HistoryState {
    history: HistoryData;
}

const initialState: HistoryState = {
    history: { past: [], present: null, future: [] },
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        setHistory(state, action: PayloadAction<HistoryData>) {
            state.history = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(resetState, () => initialState);
    },
});

export const { setHistory } = historySlice.actions;
export default historySlice.reducer;
