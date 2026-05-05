import { WeeklyCalendar } from "./components/WeeklyCalendar";

export default function App() {
  return (
    <main className="flex flex-col items-center p-4 gap-4 sm:p-8 sm:gap-6">
      <h1 className="text-2xl font-semibold sm:text-4xl sm:font-bold">Heti naptár</h1>
      <WeeklyCalendar />
    </main>
  )
}
