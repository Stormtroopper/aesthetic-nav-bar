import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  showtimeId: string | null;
  movieTitle: string | null;
  theatre: string | null;
  startsAt: string | null;
  price: number;
  selectedSeatIds: string[];
  selectedSeatLabels: string[];
}

const initialState: BookingState = {
  showtimeId: null,
  movieTitle: null,
  theatre: null,
  startsAt: null,
  price: 0,
  selectedSeatIds: [],
  selectedSeatLabels: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setShowtimeContext(
      state,
      action: PayloadAction<{
        showtimeId: string;
        movieTitle: string;
        theatre: string;
        startsAt: string;
        price: number;
      }>,
    ) {
      const { showtimeId } = action.payload;
      if (state.showtimeId !== showtimeId) {
        state.selectedSeatIds = [];
        state.selectedSeatLabels = [];
      }
      state.showtimeId = showtimeId;
      state.movieTitle = action.payload.movieTitle;
      state.theatre = action.payload.theatre;
      state.startsAt = action.payload.startsAt;
      state.price = action.payload.price;
    },
    toggleSeat(
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) {
      const idx = state.selectedSeatIds.indexOf(action.payload.id);
      if (idx >= 0) {
        state.selectedSeatIds.splice(idx, 1);
        state.selectedSeatLabels.splice(idx, 1);
      } else {
        state.selectedSeatIds.push(action.payload.id);
        state.selectedSeatLabels.push(action.payload.label);
      }
    },
    clearBooking(state) {
      state.showtimeId = null;
      state.movieTitle = null;
      state.theatre = null;
      state.startsAt = null;
      state.price = 0;
      state.selectedSeatIds = [];
      state.selectedSeatLabels = [];
    },
  },
});

export const { setShowtimeContext, toggleSeat, clearBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
