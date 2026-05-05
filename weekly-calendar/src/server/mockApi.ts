import { MOCK_APPOINTMENTS } from "./mockData";
import type { Appointment } from "./models/Appointment";

const SIMULATED_DELAY_MS = 800;

function delay(ms: number): Promise<void> {
return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
* Simulates a network request that fetches all appointments for the week.
*
* @returns A promise that resolves to an array of Appointment objects.
*/
export async function fetchAppointments(): Promise<Appointment[]> {
await delay(SIMULATED_DELAY_MS);
return structuredClone(MOCK_APPOINTMENTS);
}