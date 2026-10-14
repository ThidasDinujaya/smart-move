-- Apply procedures.sql first so booking and trip cancellation no longer reference the legacy procedure.
-- Existing reversed payment records are retained and relabeled as Cancelled.
BEGIN
    EXECUTE IMMEDIATE 'DROP PROCEDURE sp_refund_payment';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -4043 THEN
            RAISE;
        END IF;
END;
/

DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'PAYMENTS'
       AND constraint_name = 'CK_PAYMENTS_REFUND_DATE';
    IF v_count > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE payments DROP CONSTRAINT ck_payments_refund_date';
    END IF;

    SELECT COUNT(*)
      INTO v_count
      FROM user_constraints
     WHERE table_name = 'PAYMENTS'
       AND constraint_name = 'CK_PAYMENTS_STATUS';
    IF v_count > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE payments DROP CONSTRAINT ck_payments_status';
    END IF;

    UPDATE payments
       SET payment_status = 'Cancelled'
     WHERE payment_status = 'Refunded';

    EXECUTE IMMEDIATE
        'ALTER TABLE payments ADD CONSTRAINT ck_payments_status CHECK (payment_status IN (''Successful'', ''Cancelled''))';

    SELECT COUNT(*)
      INTO v_count
      FROM user_tab_columns
     WHERE table_name = 'PAYMENTS'
       AND column_name = 'REFUNDED_AT';
    IF v_count > 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE payments DROP COLUMN refunded_at';
    END IF;
END;
/

COMMIT;
