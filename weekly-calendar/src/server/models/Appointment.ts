export type Appointment = {
id: string;
title: string;
date: string; // ISO date string, e.g. "2025-04-02"
startHour: number; // inclusive, e.g. 9 for 09:00
endHour: number; // exclusive, e.g. 10 for 09:00–10:00
};