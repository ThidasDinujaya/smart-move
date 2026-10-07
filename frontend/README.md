# SmartMove Frontend

SmartMove is a React and Vite frontend for passenger, trip, booking, and payment screens.
It does not include a backend or connect to a database. Records entered during a session
are held in React state and reset when the page is refreshed.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Source layout

```text
src/
  components/  Shared layout, form, table, and interaction components
  hooks/       Reusable record state and list filtering logic
  pages/
    admin/     Passenger, trip, booking, payment, and receipt screens for admins
  styles/      Base, layout, component, form, and responsive styles
  utils/       Formatting and receipt-download helpers
  App.jsx      Screen coordination and navigation
  main.jsx     React entry point
```

Each page gets data through props. The record state lives in `useSmartMoveData.js`, so
connecting a future API or database can be done there without embedding record data in
the page components.
