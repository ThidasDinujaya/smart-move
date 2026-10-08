# SmartMove Frontend

SmartMove is a React and Vite interface for passenger, trip, booking, payment,
maintenance, feedback, and report screens. It currently runs as a standalone
frontend and makes no backend or database requests.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Local environment settings

`.env.example` is a tracked template for documenting frontend environment
variables. To create your local settings file, copy it to `.env` and add values
there using the `VITE_VARIABLE_NAME=your_local_value` format. The frontend does
not currently require any environment variables, so no values need to be added.
Keep `.env` out of GitHub; only commit `.env.example`, without private URLs or
credentials.

## Data behavior

The interface starts with empty lists and report values. This keeps the screens
free of placeholder business records while a backend is not available. Records
created in the forms are held in React memory for the current page session and
are cleared when the page is refreshed. Backend and database integration can be
added later without requiring the UI to depend on a running service now.

## Source layout

```text
src/
  components/  Shared layout, form, table, and interaction components
  hooks/       In-memory UI state and list filtering logic
  pages/
    admin/     Operations, maintenance, feedback, report, and receipt screens
  styles/      Base, layout, component, form, and responsive styles
  utils/       Formatting and receipt-download helpers
  App.jsx      Screen coordination and navigation
  main.jsx     React entry point
```
