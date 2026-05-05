# Weekly Calendar

## Demo
Check out the running app here: [Weekly Calendar](https://minup-task.vercel.app/)

## How to run this app

1. Clone the repository
2. Run `npm i` inside the `weekly-calendar` folder
3. Run `npm run dev` inside the `weekly-calendar` folder
4. Open the URL shown in the terminal

## Running Tests

> Requires the repository to be cloned and dependencies installed.

```bash
npm run test
```

## Project Structure

Inside the `src` folder:

| Folder       | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| `components` | All components used to build the app                                  |
| `hooks`      | Custom hook(s) used in the app                                        |
| `lib`        | Helper functionalities and constants commonly used throughout the app |
| `server`     | Mock server related logic (data, functionality, types)                |
| `store`      | Has all the redux store relevant files                                |
| `types`      | Custom types used in multiple places in the app                       |

## Main Components

| Component                 | Responsibility                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `WeeklyCalendar.tsx`      | Loads the main table component and handles loading and error cases                                                      |
| `CalendarTableHeader.tsx` | Handles the header part of the table — maps days to header cells and renders the "collapse all" button                  |
| `CalendarTableBody.tsx`   | Handles the rest of the table by mapping the given hours to table rows                                                  |
| `CalendarTableRow.tsx`    | Maps cells to daily columns, gets the appointment for each section, and renders the collapse button for a row if needed |

## Technologies

| Technology       | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `React`          | Main UI library                              |
| `Vite`           | Boilerplating, building and packaging        |
| `TypeScript`     | Type safety                                  |
| `Tailwind`       | Atomic CSS — great for MVP/quick prototyping |
| `Vitest`         | Unit testing                                 |
| `TanStack Query` | Handling requests                            |
| `Redux Toolkit`  | Global state management                      |
