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

## Architectural decisions

### divs vs table

First I had to decide between using a table or creating the calendar based on divs (with grid).
The div solution would provide maybe a bit more flexibility and easier customization and styling, but it also provide traps and potential UI glitches if the CSS is not perfect.
Since it IS basically a table, and the initial setup/alignment of the UI felt more straightforward, I went with the table.

### Styling

For styling I chose Tailwind. I like the atomic design methodology, and it has useful utility classes. It enables rapid prototyping, and putting out an MVP. While design is not a requirement for the task, the building blocks still had to align well. And while I won't win any design awards, I didn't want it to look like something that fell into a nuclear reactor.

### Testing

For unit testing I chose Vitest. It was between Jest and Vitest and don't have a massive preference, now I went with Vitest for this task. I added data-testids to the collapse buttons so if we'd need to do e2e/UI testing it would be easier.

### Building a spaceship instead of a paper plane

And as for the last 2 tech used...I went with a bit "over-engineering" approach since this is an "interview task", so wanted to include common technologies that are used for more "product-like products".

### Tanstack Query

To be honest for a simple single page, super bare application, I don't think I'd use them, since it only handles one API call - which is a mock api located in the same project. The necessary boilerplate probably creates more code than we get to delete by using the Tanstack Q and we don't need caching and extra functionality for this mock app.

### State management

As for the state management, this app is pretty simple and wouldn't even use many prop drilling without any tool. But to be able to completely negate prop drilling and massive prop passing onto components, I'd probably choose Context API (I did for the first iteration before adding the Redux). If I'd feel the need for global state management, I'd likely choose Zustand as it is more lightweight than Redux. But since Minup uses Redux, I used that here too.

### Component structure

I believe in SRP, so tried to create components that has only one reason (the main calendar component handles the loading/error states and rendering the table; the header component handles the top part with the days and collapse all button; the row component handles the time periods and appointment data injecting). Since a table is something that usually doesn't get tear down into parts to re-use elsewhere, my main focus was responsability and readability for the components (the button and the icon might be used also elsewhere)
And unless a logic is really intertwined with the component, I like to extract it and use more dummy-components. It keeps the code clean, easy to read and understand, the tests more focused and the logic re-usable.

## AI usage during the development

AI is both our best friend and biggest enemy as a dev. It makes development 1000000x easier and faster but also our dev experience and knowledge more shallow. But since it's hard to circumvent, I used it for a couple of things. Kept the architectural, structural decisions and core logic to myself and tried to use it for more repetitive or less integral tasks.

- I used AI for some styling (it offered me potential classNames and I just tabbed away, do your thing Copilot!)
- Used it to create the ChevronDown svg (didn't want to pull in font awesome or something similar, but using "V" for the collapse button felt natsy :-))
- I used it as a rubber duck/colleague when had to brainstorm for the group collapsing functionality. Went in circles with the solutions, so talked through with it. It was not something the AI did by itself, but helped me.
- With some unit testing (configuring vitest, and I wrote some tests, but also let the AI wrote some other test files and I just reviewed the tests there)
- After I switched to redux toolkit, the AI helped me to weed out the previous Context related logic and to update the tests
- Helped me with the markdown synthax for this readme (in fact we can thank this neat unordered list to the AI)

## Potential improvements
It's not looking great on mobile. I added a wrapper div to handle a mobile Safari issue with not being able to scroll to the left side completely, but it's still a massive table on a small screen.
Would probably need to re-think the design from UX perspective and maybe break the table into 2 parts horizontally and scale the sizes responsively to have a good user experience on mobile too.

Apart from that, it could have a more pleasing design and some animations and some user friendly extra features (like color coding events, etc).

If this would be more like a demo/test site, we could add a re-fetch and error buttons to trigger another fetch from the mock api without refreshing the page, or to trigger a certain mock error response.

With more functionality added UI/E2E tests could be introduced to the application too (Playwright/Cypress/Selenium)

When the app starts to use real data, we need some kind of auth+authZ to handle requests to the real API. I like OAuth2.0 with JWT so that would be my choice for authZ and maybe a mix of social logins and traditional username+password for authentication.

For performance...it's such a tiny app right now, but if it gets bigger, some performance optimization (like code splitting, lazy loading, compression) could be made. If it will be a big app with a lot of "passive" elements, maybe it would be worth thinking about using nextjs for SSR (apart from the collapsing functionality, I think this app would be a pretty decent target for nextjs)

Since this is an interview task, I didn't spend much time with accessibility, but if this would be a real app, that would be another important improvement.

And while I connected the repo with Vercel, so new commits automatically gets shipped online, for a real app, maybe something like AWS or Azure hosting would be preferable along with some pipelines and gates for quality, security, etc.