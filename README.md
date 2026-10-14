# SmartMove

## Set up the databases for a fresh install

SmartMove uses Oracle for relational records and MongoDB for announcements, notifications, feedback comments, and uploaded trip and vehicle media. Set up both databases before starting the backend.

ER Diagram Link :- https://drive.google.com/file/d/15QVnbhW9tUj682-7J2eJriL2mBJp3pUO/view?usp=sharing

### Oracle in SQL Developer

1. Start Oracle and connect to the `XEPDB1` service on `localhost:1521`.
2. Use the `SYSTEM` account configured by default in the backend, or configure the backend to use the schema owner you choose.
3. Open each file in `database/oracle_db` and choose **Run Script** (F5), in this order:
   1. `tables.sql` — creates the relational tables.
   2. `triggers.sql` — creates the maintenance trigger.
   3. `functions.sql` — creates the seat-availability function.
   4. `procedures.sql` — creates the payment and trip procedures.
   5. `reports.sql` — creates the five report procedures.
   6. `example_data.sql` — inserts the connected sample records.

The sample accounts use `Welcome123!` as their password. Run `tables.sql` only when setting up a new or empty SmartMove schema; it will fail if the tables already exist. Hibernate is set to validate the schema, so create the Oracle tables and procedures before starting the backend.

### MongoDB in Compass

1. Start MongoDB and connect Compass to `mongodb://localhost:27017`.
2. Create a database named `smartmove` and a collection named `feedback`.
3. Import each JSON array below into the collection with the same name. Create the other collections in Compass before importing their files.

   | Collection | Import file |
   | --- | --- |
   | `feedback` | `database/mongo_db/feedback.json` |
   | `notifications` | `database/mongo_db/notifications.json` |
   | `travel_announcements` | `database/mongo_db/travel_announcements.json` |
   | `trip_media` | `database/mongo_db/trip_media.json` |
   | `vehicle_media` | `database/mongo_db/vehicle_media.json` |

Use **Add Data > Import JSON or CSV** and select JSON for each file. Import the Oracle sample data first so the passenger, trip, route, vehicle, and driver IDs in these documents refer to existing records. Import each file once into an empty collection; importing it again creates duplicate sample documents. The sample media records show titles and file types, but have no uploaded file; upload a PDF or image in the admin media section to add viewable content. The backend creates its `id_sequences` collection automatically when it first allocates a public ID.

## Backend database settings

The default Oracle connection is `jdbc:oracle:thin:@//localhost:1521/XEPDB1` with username `SYSTEM`. Set `ORACLE_DB_PASSWORD` in `backend/.env`, using `backend/.env.example` as a reference. MongoDB defaults to host `localhost`, port `27017`, and database `smartmove`. Change these settings with the variables listed in `backend/.env.example`.
