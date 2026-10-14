# SmartMove

## Set up the databases for a fresh install

SmartMove uses Oracle for relational records and MongoDB for announcements, notifications, feedback comments, and uploaded trip and vehicle media. Set up both databases before starting the backend.

### Oracle in SQL Developer

1. Start Oracle and connect to the `XEPDB1` service on `localhost:1521`.
2. Use the `SYSTEM` account configured by default in the backend, or configure the backend to use the schema owner you choose.
3. Open `database/oracle_db/install.sql` and choose **Run Script** (F5).

The install script creates the Oracle tables, loads connected sample rows, creates the maintenance trigger and seat-availability function, installs payment and trip procedures, and runs the five report procedures. The sample accounts use `Welcome123!` as their password.

This is an initial-install script for a new or empty SmartMove schema. It does not drop tables or erase existing data. Do not run it over an existing populated schema or run it a second time; the table creation will stop when it encounters existing objects. Hibernate is set to validate the schema, so the Oracle tables and procedures must be installed before the backend starts.

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
