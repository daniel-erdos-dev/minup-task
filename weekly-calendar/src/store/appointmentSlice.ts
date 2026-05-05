import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Appointment} from "../server/models/Appointment";

interface AppointmentState {
  appointments: Appointment[];
}

const initialState: AppointmentState = {
  appointments: [],
};

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
  },
});

export const {setAppointments} = appointmentSlice.actions;

export const selectAppointments = (state: {appointments: AppointmentState}) =>
  state.appointments.appointments;

export default appointmentSlice.reducer;
