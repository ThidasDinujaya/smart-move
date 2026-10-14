# SmartMove

## Set up the databases

Run the Oracle SQL files and import the MongoDB JSON files before starting the backend. Use the existing files in `database/oracle_db` and `database/mongo_db`.

### Oracle in SQL Developer

Connect to the Oracle database with these settings:

- Connection name: `SMARTMOVE` (this is only a label)
- Username: `SYSTEM`
- Password: your Oracle `SYSTEM` password
- Host: `localhost`
- Port: `1521`
- Select **Service name** and enter `XEPDB1`

Open and run each file below in SQL Developer, in this order. Use **Run Script** (F5) for each file and check its Script Output before continuing:

1. `database/oracle_db/tables.sql` — creates the tables.
2. `database/oracle_db/example_data.sql` — inserts the sample records.
3. `database/oracle_db/triggers.sql` — creates the maintenance trigger.
4. `database/oracle_db/functions.sql` — creates the available-seats function.
5. `database/oracle_db/procedures.sql` — creates payment, cancellation, and trip-completion procedures.
6. `database/oracle_db/remove_refund_support.sql` — removes legacy payment reversal support and its schema fields.
7. `database/oracle_db/reports.sql` — creates the five report procedures and prints sample results.

Run these scripts against the `SYSTEM` connection to `XEPDB1`. `tables.sql` creates the current SmartMove tables and does not drop or clear existing objects, so remove earlier SmartMove tables first if you are rebuilding; unrelated tables in the schema are left alone. The backend calls the stored seat-availability function, payment and cancellation procedures, trip-completion procedure, and report procedures. The `reports.sql` sample output appears in SQL Developer's Script Output.

For an existing database, run the updated `procedures.sql` and then `remove_refund_support.sql`; do not rerun `tables.sql` or `example_data.sql` unless you are rebuilding the database.

### MongoDB in Compass

1. Start MongoDB and connect Compass to `mongodb://localhost:27017`.
2. Create a database named `smartmove` and its first collection, `feedback`.
3. Select `feedback`, choose **Add Data > Import JSON or CSV**, and import `database/mongo_db/feedback.json` as JSON.
4. Create each remaining collection and import its matching file the same way:

   | Collection | File |
   | --- | --- |
   | `notifications` | `database/mongo_db/notifications.json` |
   | `travel_announcements` | `database/mongo_db/travel_announcements.json` |
   | `trip_media` | `database/mongo_db/trip_media.json` |
   | `vehicle_media` | `database/mongo_db/vehicle_media.json` |

Each file contains a JSON array for one collection. Import each file once into its matching empty collection; importing again adds duplicate sample documents.

## Backend database settings

The backend expects the Oracle schema to exist; Hibernate is configured to validate it rather than create tables. Its default Oracle URL is `jdbc:oracle:thin:@//localhost:1521/XEPDB1`, with username `SYSTEM`. Set `ORACLE_DB_PASSWORD` to your Oracle password in your local `backend/.env` file, using `backend/.env.example` as a reference.

MongoDB defaults to host `localhost`, port `27017`, and database `smartmove`. These settings can be changed through the variables listed in `backend/.env.example`.
