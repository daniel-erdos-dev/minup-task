How to run this app:
1, Clone the repository
2, Run `npm i` inside the weekly-calendar folder
3, Run `npm run dev` inside the weekly-calendar folder
4, Open the url that is shown in the terminal

How to run tests:
0, If the repository is cloned and the dependencies are installed
1, Run `npm run test` inside the weekly-calendar folder

Folder construction for the project:
Inside the src folder there are these folders:

- components: containing all the components used to build the app
- hooks: containing the custom hook(s) used in the app
- lib: containing helper functionalities and constants commonly used throughout the app
- server: containing mock server related logic (data, functionality, types)
- types: containing custom types used multiple places in the app
- context: containing Context API related code

Main components, parts:
WeeklyCalendar.tsx - Responsible for loading the main table component and handling loading and error cases
CalendarTableHeader.tsx - Responsible for handling the header part of the table - mapping the days to header cells and also the "collapse all" button
CalendarTableBody.tsx - Handling the rest of the table by mapping the given hours to table rows
CalendarTableRow.tsx - Responsible for mapping the cells to the daily columns and getting the appointment for that section. Also responsible for rendering the collapse button for that row if needed

Technology used:

- React: as the main UI library to create the project
- Vite: For boilerplating, building and packaging
- Typescript: For type safety
- Tailwind: For atomic CSS which is great for MVP/quick prototyping

- Vitest: For unit testing
- Tanstack query: For handling requests
- Redux toolkit: For global state management
