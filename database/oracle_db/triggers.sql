-- Keep the vehicle service date in step with completed maintenance.

CREATE OR REPLACE TRIGGER trg_maintenance_service_date
AFTER INSERT OR UPDATE OF status, start_date, vehicle_id ON maintenance
FOR EACH ROW
WHEN (NEW.status = 'Completed' AND NEW.start_date IS NOT NULL)
BEGIN
    UPDATE vehicles
       SET last_service_date = :NEW.start_date
     WHERE id = :NEW.vehicle_id;
END;
/
